<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Product;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ReviewController extends Controller
{
    /**
     * Get reviews for a product
     */
    public function index(Request $request, Product $product)
    {
        $reviews = $product->reviews()
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($reviews);
    }

    /**
     * Store a new review
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'order_id' => 'nullable|exists:orders,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'videos' => 'nullable|array|max:3',
            'videos.*' => 'mimes:mp4,avi,mov|max:10240', // 10MB max
        ]);

        $user = $request->user();

        // Check if user has already reviewed this product
        $existingReview = Review::where('user_id', $user->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($existingReview) {
            return response()->json([
                'message' => 'You have already reviewed this product'
            ], 422);
        }

        // Check if order_id is provided, verify user owns the order and it's delivered/processed
        $isVerifiedPurchase = false;
        if ($request->order_id) {
            $order = Order::where('id', $request->order_id)
                ->where('user_id', $user->id)
                ->whereIn('status', ['delivered', 'processed'])
                ->first();

            if (!$order) {
                return response()->json([
                    'message' => 'Invalid order or order not eligible for review'
                ], 422);
            }

            $isVerifiedPurchase = true;
        }

        // Handle file uploads
        $imagePaths = [];
        $videoPaths = [];

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('reviews/images', 'public');
                $imagePaths[] = $path;
            }
        }

        if ($request->hasFile('videos')) {
            foreach ($request->file('videos') as $video) {
                $path = $video->store('reviews/videos', 'public');
                $videoPaths[] = $path;
            }
        }

        $review = Review::create([
            'user_id' => $user->id,
            'product_id' => $request->product_id,
            'order_id' => $request->order_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'images' => $imagePaths,
            'videos' => $videoPaths,
            'is_verified_purchase' => $isVerifiedPurchase,
        ]);

        return response()->json([
            'message' => 'Review submitted successfully',
            'review' => $review->load('user')
        ], 201);
    }

    /**
     * Update a review
     */
    public function update(Request $request, Review $review)
    {
        // Check if review belongs to user
        if ($review->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'videos' => 'nullable|array|max:3',
            'videos.*' => 'mimes:mp4,avi,mov|max:10240',
        ]);

        // Handle file uploads
        $imagePaths = $review->images ?? [];
        $videoPaths = $review->videos ?? [];

        if ($request->hasFile('images')) {
            // Delete old images
            foreach ($imagePaths as $imagePath) {
                Storage::disk('public')->delete($imagePath);
            }
            
            $imagePaths = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('reviews/images', 'public');
                $imagePaths[] = $path;
            }
        }

        if ($request->hasFile('videos')) {
            // Delete old videos
            foreach ($videoPaths as $videoPath) {
                Storage::disk('public')->delete($videoPath);
            }
            
            $videoPaths = [];
            foreach ($request->file('videos') as $video) {
                $path = $video->store('reviews/videos', 'public');
                $videoPaths[] = $path;
            }
        }

        $review->update([
            'rating' => $request->rating,
            'comment' => $request->comment,
            'images' => $imagePaths,
            'videos' => $videoPaths,
        ]);

        return response()->json([
            'message' => 'Review updated successfully',
            'review' => $review->load('user')
        ]);
    }

    /**
     * Delete a review
     */
    public function destroy(Request $request, Review $review)
    {
        // Check if review belongs to user
        if ($review->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        // Delete associated files
        foreach ($review->images ?? [] as $imagePath) {
            Storage::disk('public')->delete($imagePath);
        }

        foreach ($review->videos ?? [] as $videoPath) {
            Storage::disk('public')->delete($videoPath);
        }

        $review->delete();

        return response()->json([
            'message' => 'Review deleted successfully'
        ]);
    }

    /**
     * Get user's reviews
     */
    public function userReviews(Request $request)
    {
        $reviews = $request->user()->reviews()
            ->with('product')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($reviews);
    }
}