<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Get all categories
     */
    public function index()
    {
        $categories = Category::active()->withCount('products')->get();
        return response()->json($categories);
    }

    /**
     * Get a specific category
     */
    public function show(Category $category)
    {
        $category->load('products');
        return response()->json($category);
    }
}
