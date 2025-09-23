<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Grocery',
                'slug' => 'grocery',
                'description' => 'Fresh groceries and daily essentials',
                'allows_delivery' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Dry Goods',
                'slug' => 'dry-goods',
                'description' => 'Non-perishable items and dry goods (Pickup only)',
                'allows_delivery' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Farm Supply',
                'slug' => 'farm-supply',
                'description' => 'Agricultural supplies and farming equipment',
                'allows_delivery' => true,
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
