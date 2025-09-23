<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $groceryCategory = Category::where('slug', 'grocery')->first();
        $dryGoodsCategory = Category::where('slug', 'dry-goods')->first();
        $farmSupplyCategory = Category::where('slug', 'farm-supply')->first();

        // Grocery Products
        $groceryProducts = [
            [
                'name' => 'Fresh Tomatoes',
                'slug' => 'fresh-tomatoes',
                'description' => 'Fresh, ripe tomatoes perfect for cooking',
                'price' => 45.00,
                'stock_quantity' => 50,
                'unit' => 'kg',
                'weight' => 1.0,
                'category_id' => $groceryCategory->id,
            ],
            [
                'name' => 'White Rice',
                'slug' => 'white-rice',
                'description' => 'Premium quality white rice',
                'price' => 55.00,
                'stock_quantity' => 30,
                'unit' => 'kg',
                'weight' => 1.0,
                'category_id' => $groceryCategory->id,
            ],
            [
                'name' => 'Fresh Milk',
                'slug' => 'fresh-milk',
                'description' => 'Fresh cow milk, 1 liter',
                'price' => 65.00,
                'stock_quantity' => 25,
                'unit' => 'liter',
                'weight' => 1.0,
                'category_id' => $groceryCategory->id,
            ],
            [
                'name' => 'Eggs (Dozen)',
                'slug' => 'eggs-dozen',
                'description' => 'Fresh chicken eggs, 12 pieces',
                'price' => 85.00,
                'stock_quantity' => 40,
                'unit' => 'dozen',
                'weight' => 0.8,
                'category_id' => $groceryCategory->id,
            ],
        ];

        // Dry Goods Products
        $dryGoodsProducts = [
            [
                'name' => 'Canned Corned Beef',
                'slug' => 'canned-corned-beef',
                'description' => 'Premium corned beef, 150g can',
                'price' => 45.00,
                'stock_quantity' => 100,
                'unit' => 'can',
                'weight' => 0.15,
                'category_id' => $dryGoodsCategory->id,
            ],
            [
                'name' => 'Instant Noodles',
                'slug' => 'instant-noodles',
                'description' => 'Chicken flavored instant noodles',
                'price' => 12.00,
                'stock_quantity' => 200,
                'unit' => 'pack',
                'weight' => 0.08,
                'category_id' => $dryGoodsCategory->id,
            ],
            [
                'name' => 'Cooking Oil',
                'slug' => 'cooking-oil',
                'description' => 'Vegetable cooking oil, 1 liter',
                'price' => 85.00,
                'stock_quantity' => 50,
                'unit' => 'bottle',
                'weight' => 1.0,
                'category_id' => $dryGoodsCategory->id,
            ],
            [
                'name' => 'Sugar',
                'slug' => 'sugar',
                'description' => 'White refined sugar, 1kg',
                'price' => 55.00,
                'stock_quantity' => 40,
                'unit' => 'kg',
                'weight' => 1.0,
                'category_id' => $dryGoodsCategory->id,
            ],
        ];

        // Farm Supply Products
        $farmSupplyProducts = [
            [
                'name' => 'Fertilizer (NPK)',
                'slug' => 'fertilizer-npk',
                'description' => 'Complete NPK fertilizer for crops',
                'price' => 150.00,
                'stock_quantity' => 25,
                'unit' => 'kg',
                'weight' => 1.0,
                'category_id' => $farmSupplyCategory->id,
            ],
            [
                'name' => 'Seeds - Tomato',
                'slug' => 'seeds-tomato',
                'description' => 'High-yield tomato seeds',
                'price' => 25.00,
                'stock_quantity' => 50,
                'unit' => 'pack',
                'weight' => 0.01,
                'category_id' => $farmSupplyCategory->id,
            ],
            [
                'name' => 'Garden Hose',
                'slug' => 'garden-hose',
                'description' => 'Flexible garden hose, 50 feet',
                'price' => 350.00,
                'stock_quantity' => 15,
                'unit' => 'piece',
                'weight' => 2.0,
                'category_id' => $farmSupplyCategory->id,
            ],
            [
                'name' => 'Pesticide',
                'slug' => 'pesticide',
                'description' => 'Organic pesticide for vegetables',
                'price' => 120.00,
                'stock_quantity' => 20,
                'unit' => 'bottle',
                'weight' => 0.5,
                'category_id' => $farmSupplyCategory->id,
            ],
        ];

        $allProducts = array_merge($groceryProducts, $dryGoodsProducts, $farmSupplyProducts);

        foreach ($allProducts as $product) {
            Product::create($product);
        }
    }
}
