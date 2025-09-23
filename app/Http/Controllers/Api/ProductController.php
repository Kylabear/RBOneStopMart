<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Get all products with optional filtering
     */
    public function index(Request $request)
    {
        $query = Product::with('category')->active();

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by category slug
        if ($request->has('category_slug')) {
            $category = Category::where('slug', $request->category_slug)->first();
            if ($category) {
                $query->where('category_id', $category->id);
            }
        }

        // Search by name or description
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by stock availability
        if ($request->has('in_stock') && $request->in_stock) {
            $query->inStock();
        }

        // Sort options
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        if (in_array($sortBy, ['name', 'price', 'created_at'])) {
            $query->orderBy($sortBy, $sortOrder);
        }

        $products = $query->paginate($request->get('per_page', 15));

        return response()->json($products);
    }

    /**
     * Get a specific product
     */
    public function show(Product $product)
    {
        $product->load('category');
        return response()->json($product);
    }

    /**
     * Get products by category
     */
    public function byCategory(Category $category)
    {
        $products = $category->activeProducts()->with('category')->paginate(15);
        return response()->json($products);
    }

    /**
     * Get featured products
     */
    public function featured()
    {
        $products = Product::with('category')
            ->active()
            ->inStock()
            ->orderBy('created_at', 'desc')
            ->limit(8)
            ->get();

        return response()->json($products);
    }
}
