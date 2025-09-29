<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use App\Notifications\NewOrderNotification;
use App\Notifications\OrderStatusNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class OrderController extends Controller
{
    /**
     * Get user's orders
     */
    public function index()
    {
        $orders = Order::with('orderItems.product')
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($orders);
    }

    /**
     * Get a specific order
     */
    public function show(Order $order)
    {
        // Ensure the order belongs to the authenticated user
        if ($order->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $order->load('orderItems.product.category');
        return response()->json($order);
    }

    /**
     * Create a new order
     */
    public function store(Request $request)
    {
        $request->validate([
            'delivery_method' => 'required|in:delivery,pickup',
            'payment_method' => 'required|in:cod,gcash,paymaya',
            'delivery_address' => 'required_if:delivery_method,delivery|nullable|string',
            'contact_phone' => 'required|string',
            'notes' => 'nullable|string',
            'delivery_date' => 'nullable|date|after:now',
        ]);

        $cartItems = CartItem::with('product.category')
            ->where('user_id', Auth::id())
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'message' => 'Cart is empty'
            ], 400);
        }

        // Check if any cart items are from Dry Goods category and delivery method is delivery
        $dryGoodsItems = $cartItems->filter(function ($item) {
            return $item->product->category->slug === 'dry-goods';
        });

        if ($dryGoodsItems->isNotEmpty() && $request->delivery_method === 'delivery') {
            return response()->json([
                'message' => 'Dry Goods items can only be picked up, not delivered'
            ], 400);
        }

        DB::beginTransaction();

        try {
            // Create order
            $order = Order::create([
                'order_number' => Order::generateOrderNumber(),
                'user_id' => Auth::id(),
                'total_amount' => 0, // Will be calculated
                'delivery_method' => $request->delivery_method,
                'payment_method' => $request->payment_method,
                'delivery_address' => $request->delivery_address,
                'contact_phone' => $request->contact_phone,
                'notes' => $request->notes,
                'delivery_date' => $request->delivery_date,
            ]);

            $totalAmount = 0;

            // Create order items and update stock
            foreach ($cartItems as $cartItem) {
                $product = $cartItem->product;

                // Check stock availability
                if ($product->stock_quantity < $cartItem->quantity) {
                    throw new \Exception("Insufficient stock for product: {$product->name}");
                }

                $unitPrice = $product->price;
                $totalPrice = $unitPrice * $cartItem->quantity;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $cartItem->quantity,
                    'unit_price' => $unitPrice,
                    'total_price' => $totalPrice,
                ]);

                // Update product stock
                $product->stock_quantity -= $cartItem->quantity;
                $product->save();

                $totalAmount += $totalPrice;
            }

            // Update order total
            $order->total_amount = $totalAmount;
            $order->save();

            // Clear cart
            CartItem::where('user_id', Auth::id())->delete();

            DB::commit();

            // Send notification to all admin users
            $adminUsers = User::where('role', 'admin')->get();
            foreach ($adminUsers as $admin) {
                $admin->notify(new NewOrderNotification($order));
            }

            // Send notification to customer
            Auth::user()->notify(new OrderStatusNotification($order, 'pending'));

            return response()->json([
                'message' => 'Order created successfully',
                'order' => $order->load('orderItems.product')
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Failed to create order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cancel an order
     */
    public function cancel(Order $order)
    {
        // Ensure the order belongs to the authenticated user
        if ($order->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Only allow cancellation of pending orders
        if ($order->status !== 'pending') {
            return response()->json([
                'message' => 'Order cannot be cancelled'
            ], 400);
        }

        DB::beginTransaction();

        try {
            // Restore stock
            foreach ($order->orderItems as $orderItem) {
                $product = $orderItem->product;
                $product->stock_quantity += $orderItem->quantity;
                $product->save();
            }

            // Update order status
            $order->status = 'cancelled';
            $order->save();

            DB::commit();

            return response()->json([
                'message' => 'Order cancelled successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Failed to cancel order'
            ], 500);
        }
    }
}
