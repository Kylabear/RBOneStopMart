<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AddressController extends Controller
{
    /**
     * Get user's addresses
     */
    public function index(Request $request)
    {
        $addresses = $request->user()->addresses()->orderBy('is_default', 'desc')->get();
        return response()->json($addresses);
    }

    /**
     * Store a new address
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'label' => 'required|string|max:50',
                'contact_name' => 'required|string|max:255',
                'contact_phone' => 'required|string|max:20',
                'address' => 'required|string',
                'city' => 'required|string|max:100',
                'province' => 'required|string|max:100',
                'postal_code' => 'nullable|string|max:10',
                'landmark' => 'nullable|string|max:255',
                'is_default' => 'boolean',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }

        // Check if user already has 3 addresses
        $addressCount = $request->user()->addresses()->count();
        if ($addressCount >= 3) {
            return response()->json([
                'message' => 'You can only have up to 3 addresses'
            ], 422);
        }

        \Log::info('Creating address for user: ' . $request->user()->id, $request->all());

        DB::beginTransaction();
        try {
            // If this is set as default, unset other defaults
            if ($request->is_default) {
                $request->user()->addresses()->update(['is_default' => false]);
            }

            $address = $request->user()->addresses()->create($request->all());

            DB::commit();

            return response()->json([
                'message' => 'Address added successfully',
                'address' => $address
            ], 201);
        } catch (\Exception $e) {
            DB::rollback();
            \Log::error('Address creation failed: ' . $e->getMessage(), [
                'user_id' => $request->user()->id,
                'data' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Failed to add address',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update an address
     */
    public function update(Request $request, UserAddress $address)
    {
        // Check if address belongs to user
        if ($address->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $request->validate([
            'label' => 'required|string|max:50',
            'contact_name' => 'required|string|max:255',
            'contact_phone' => 'required|string|max:20',
            'address' => 'required|string',
            'city' => 'required|string|max:100',
            'province' => 'required|string|max:100',
            'postal_code' => 'nullable|string|max:10',
            'landmark' => 'nullable|string|max:255',
            'is_default' => 'boolean',
        ]);

        DB::beginTransaction();
        try {
            // If this is set as default, unset other defaults
            if ($request->is_default) {
                $request->user()->addresses()->where('id', '!=', $address->id)->update(['is_default' => false]);
            }

            $address->update($request->all());

            DB::commit();

            return response()->json([
                'message' => 'Address updated successfully',
                'address' => $address
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Failed to update address',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete an address
     */
    public function destroy(Request $request, UserAddress $address)
    {
        // Check if address belongs to user
        if ($address->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $address->delete();

        return response()->json([
            'message' => 'Address deleted successfully'
        ]);
    }

    /**
     * Set default address
     */
    public function setDefault(Request $request, UserAddress $address)
    {
        // Check if address belongs to user
        if ($address->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        DB::beginTransaction();
        try {
            // Unset all other defaults
            $request->user()->addresses()->update(['is_default' => false]);
            
            // Set this as default
            $address->update(['is_default' => true]);

            DB::commit();

            return response()->json([
                'message' => 'Default address updated successfully',
                'address' => $address
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Failed to update default address',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}