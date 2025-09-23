<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'quantity',
    ];

    /**
     * Get the user that owns the cart item
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the product that owns the cart item
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get total price for this cart item
     */
    public function getTotalPriceAttribute(): float
    {
        return $this->quantity * $this->product->price;
    }
}
