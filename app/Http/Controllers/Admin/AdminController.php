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
            'total_products' => Product::count(),
            'total_categories' => Category::count(),
            'total_customers' => User::where('role', 'customer')->count(),
            'total_revenue' => Order::where('status', '!=', 'cancelled')->sum('total_amount'),
        ];

        $recentOrders = Order::with('user', 'orderItems.product')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $lowStockProducts = Product::where('stock_quantity', '<=', 10)
            ->where('is_active', true)
            ->get();

        return response()->json([
            'stats' => $stats,
            'recent_orders' => $recentOrders,
            'low_stock_products' => $lowStockProducts,
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
            'status' => 'required|in:pending,confirmed,preparing,ready,delivered,cancelled',
        ]);

        $oldStatus = $order->status;
        $order->status = $request->status;
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
