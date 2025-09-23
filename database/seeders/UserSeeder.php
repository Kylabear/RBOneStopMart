<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@rbonestopmart.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '09123968514',
            'address' => 'Admin Address',
        ]);

        // Create sample customer
        User::create([
            'name' => 'John Doe',
            'email' => 'customer@example.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'phone' => '09123456789',
            'address' => '123 Customer Street, City',
            'whatsapp' => '+639123456789',
            'facebook' => 'John Doe',
        ]);
    }
}
