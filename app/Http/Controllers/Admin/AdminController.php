<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Category;
use App\Models\User;
use App\Notifications\OrderStatusNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Get admin dashboard statistics
     */
    public function dashboard()
    {
        $stats = [
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'confirmed_orders' => Order::where('status', 'confirmed')->count(),
            'ready_orders' => Order::where('status', 'mark_ready')->count(),
            'delivered_orders' => Order::where('status', 'delivered')->count(),
            'processed_orders' => Order::where('status', 'processed')->count(),
            'cancelled_orders' => Order::where('status', 'cancelled')->count(),
            'total_products' => Product::count(),
            'total_categories' => Category::count(),
            'total_customers' => User::where('role', 'customer')->count(),
            'total_revenue' => Order::where('status', '!=', 'cancelled')->sum('total_amount'),
            'low_stock_count' => Product::where('stock_quantity', '<=', 10)->where('is_active', true)->count(),
            'out_of_stock_count' => Product::where('stock_quantity', '=', 0)->where('is_active', true)->count(),
        ];

        $recentOrders = Order::with('user', 'orderItems.product')
            ->orderBy('created_at', 'desc')
            ->limit(15)
            ->get();

        $lowStockProducts = Product::where('stock_quantity', '<=', 10)
            ->where('is_active', true)
            ->with('category')
            ->get();

        $users = User::with('orders')
            ->orderBy('created_at', 'desc')
            ->get();

        $products = Product::with('category')
            ->orderBy('name', 'asc')
            ->get();

        // Add more detailed stats
        $stats['in_stock_count'] = Product::where('stock_quantity', '>', 10)->where('is_active', true)->count();
        $stats['active_products'] = Product::where('is_active', true)->count();
        $stats['active_users'] = User::where('email_verified_at', '!=', null)->count();
        $stats['new_users_this_month'] = User::whereMonth('created_at', now()->month)->count();

        // Calculate user statistics
        $userStats = [
            'total' => $users->count(),
            'active' => $users->where('email_verified_at', '!=', null)->count(),
            'new_this_month' => $users->where('created_at', '>=', now()->startOfMonth())->count(),
            'data' => $users
        ];

        // Calculate product statistics
        $productStats = [
            'total' => $products->count(),
            'active' => $products->where('is_active', true)->count(),
            'in_stock' => $products->where('stock_quantity', '>', 10)->where('is_active', true)->count(),
            'low_stock' => $products->where('stock_quantity', '<=', 10)->where('stock_quantity', '>', 0)->where('is_active', true)->count(),
            'out_of_stock' => $products->where('stock_quantity', 0)->where('is_active', true)->count(),
            'data' => $products
        ];

        // Get fast moving products (top selling products)
        $fastMovingProducts = Product::with('category')
            ->withCount('orderItems')
            ->orderBy('order_items_count', 'desc')
            ->limit(10)
            ->get();

        // Get category analytics
        $categoryAnalytics = Category::withCount('products')
            ->with(['products' => function($query) {
                $query->withCount('orderItems');
            }])
            ->get()
            ->map(function($category) {
                $totalSales = $category->products->sum(function($product) {
                    return $product->order_items_count * $product->price;
                });
                
                return [
                    'product_count' => $category->products_count,
                    'order_count' => $category->products->sum('order_items_count'),
                    'total_sales' => $totalSales
                ];
            });

        return response()->json([
            'stats' => $stats,
            'recent_orders' => $recentOrders,
            'low_stock_products' => $lowStockProducts,
            'users' => $userStats,
            'products' => $productStats,
            'fast_moving_products' => $fastMovingProducts,
            'category_analytics' => $categoryAnalytics,
        ]);
    }

    /**
     * Get all orders with filtering
     */
    public function orders(Request $request)
    {
        $query = Order::with('user', 'orderItems.product');

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Search by order number or customer name
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $orders = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($orders);
    }

    /**
     * Update order status
     */
    public function updateOrderStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,start_preparing,mark_ready,out_for_delivery,delivered,processed,cancelled',
            'cancellation_reason' => 'required_if:status,cancelled|string|max:1000',
        ]);

        $oldStatus = $order->status;
        
        // If cancelling, require cancellation reason
        if ($request->status === 'cancelled' && !$request->cancellation_reason) {
            return response()->json([
                'message' => 'Cancellation reason is required when cancelling an order'
            ], 422);
        }

        $order->status = $request->status;
        
        // Set cancellation reason if cancelling
        if ($request->status === 'cancelled') {
            $order->cancellation_reason = $request->cancellation_reason;
        } else {
            $order->cancellation_reason = null;
        }
        
        $order->save();

        // Send notification to customer if status changed
        if ($oldStatus !== $request->status) {
            $order->user->notify(new OrderStatusNotification($order, $request->status));
        }

        return response()->json([
            'message' => 'Order status updated successfully',
            'order' => $order->load('user', 'orderItems.product')
        ]);
    }

    /**
     * Get order details
     */
    public function orderDetails(Order $order)
    {
        $order->load('user', 'orderItems.product.category');
        return response()->json($order);
    }
}
