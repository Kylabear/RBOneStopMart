<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Get user's cart items
     */
    public function index()
    {
        $cartItems = CartItem::with('product.category')
            ->where('user_id', Auth::id())
            ->get();

        $total = $cartItems->sum('total_price');

        return response()->json([
            'items' => $cartItems,
            'total' => $total,
            'item_count' => $cartItems->count(),
        ]);
    }

    /**
     * Add item to cart
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);

        // Check if product is in stock
        if ($product->stock_quantity < $request->quantity) {
            return response()->json([
                'message' => 'Insufficient stock available'
            ], 400);
        }

        // Check if product is active
        if (!$product->is_active) {
            return response()->json([
                'message' => 'Product is not available'
            ], 400);
        }

        // Check if item already exists in cart
        $cartItem = CartItem::where('user_id', Auth::id())
            ->where('product_id', $request->product_id)
            ->first();

        if ($cartItem) {
            $cartItem->quantity += $request->quantity;
            $cartItem->save();
        } else {
            CartItem::create([
                'user_id' => Auth::id(),
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
            ]);
        }

        return response()->json([
            'message' => 'Item added to cart successfully'
        ]);
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, CartItem $cartItem)
    {
        // Ensure the cart item belongs to the authenticated user
        if ($cartItem->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        // Check stock availability
        if ($cartItem->product->stock_quantity < $request->quantity) {
            return response()->json([
                'message' => 'Insufficient stock available'
            ], 400);
        }

        $cartItem->quantity = $request->quantity;
        $cartItem->save();

        return response()->json([
            'message' => 'Cart item updated successfully'
        ]);
    }

    /**
     * Remove item from cart
     */
    public function destroy(CartItem $cartItem)
    {
        // Ensure the cart item belongs to the authenticated user
        if ($cartItem->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $cartItem->delete();

        return response()->json([
            'message' => 'Item removed from cart successfully'
        ]);
    }

    /**
     * Clear entire cart
     */
    public function clear()
    {
        CartItem::where('user_id', Auth::id())->delete();

        return response()->json([
            'message' => 'Cart cleared successfully'
        ]);
    }
}
