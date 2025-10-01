<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAddress extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'label',
        'contact_name',
        'contact_phone',
        'address',
        'city',
        'province',
        'postal_code',
        'landmark',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    /**
     * Get the user that owns the address
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the full address as a single string
     */
    public function getFullAddressAttribute()
    {
        $parts = [
            $this->address,
            $this->city,
            $this->province,
        ];

        if ($this->postal_code) {
            $parts[] = $this->postal_code;
        }

        return implode(', ', $parts);
    }
}
