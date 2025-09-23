<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductManagementController extends Controller
{
    /**
     * Get all products for admin
     */
    public function index(Request $request)
    {
        $query = Product::with('category');

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Search by name or description
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by stock status
        if ($request->has('stock_status')) {
            if ($request->stock_status === 'low') {
                $query->where('stock_quantity', '<=', 10);
            } elseif ($request->stock_status === 'out') {
                $query->where('stock_quantity', 0);
            }
        }

        $products = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($products);
    }

    /**
     * Create a new product
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'unit' => 'nullable|string|max:50',
            'weight' => 'nullable|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'gallery' => 'nullable|array',
            'gallery.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $productData = $request->except(['image', 'gallery']);

        // Handle main image upload
        if ($request->hasFile('image')) {
            $productData['image'] = $request->file('image')->store('products', 'public');
        }

        // Handle gallery uploads
        if ($request->hasFile('gallery')) {
            $galleryPaths = [];
            foreach ($request->file('gallery') as $image) {
                $galleryPaths[] = $image->store('products/gallery', 'public');
            }
            $productData['gallery'] = $galleryPaths;
        }

        $product = Product::create($productData);

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product->load('category')
        ], 201);
    }

    /**
     * Update a product
     */
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'unit' => 'nullable|string|max:50',
            'weight' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'gallery' => 'nullable|array',
            'gallery.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $productData = $request->except(['image', 'gallery']);

        // Handle main image upload
        if ($request->hasFile('image')) {
            // Delete old image
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $productData['image'] = $request->file('image')->store('products', 'public');
        }

        // Handle gallery uploads
        if ($request->hasFile('gallery')) {
            // Delete old gallery images
            if ($product->gallery) {
                foreach ($product->gallery as $image) {
                    Storage::disk('public')->delete($image);
                }
            }
            $galleryPaths = [];
            foreach ($request->file('gallery') as $image) {
                $galleryPaths[] = $image->store('products/gallery', 'public');
            }
            $productData['gallery'] = $galleryPaths;
        }

        $product->update($productData);

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product->load('category')
        ]);
    }

    /**
     * Delete a product
     */
    public function destroy(Product $product)
    {
        // Delete associated images
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        if ($product->gallery) {
            foreach ($product->gallery as $image) {
                Storage::disk('public')->delete($image);
            }
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }

    /**
     * Update product stock
     */
    public function updateStock(Request $request, Product $product)
    {
        $request->validate([
            'stock_quantity' => 'required|integer|min:0',
        ]);

        $product->stock_quantity = $request->stock_quantity;
        $product->save();

        return response()->json([
            'message' => 'Stock updated successfully',
            'product' => $product
        ]);
    }

    /**
     * Get low stock products
     */
    public function lowStock()
    {
        $products = Product::where('stock_quantity', '<=', 10)
            ->where('is_active', true)
            ->with('category')
            ->get();

        return response()->json($products);
    }
}
