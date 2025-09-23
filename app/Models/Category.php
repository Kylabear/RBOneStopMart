<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'image',
        'allows_delivery',
        'is_active',
    ];

    protected $casts = [
        'allows_delivery' => 'boolean',
        'is_active' => 'boolean',
    ];

    /**
     * Get products for this category
     */
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Get active products for this category
     */
    public function activeProducts()
    {
        return $this->hasMany(Product::class)->where('is_active', true);
    }

    /**
     * Scope for active categories
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
