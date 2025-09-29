<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if admin user already exists
        $existingAdmin = User::where('email', 'R&BONESTOPMART@EMAIL.COM')->first();
        
        if ($existingAdmin) {
            $this->command->info('Admin user already exists!');
            $this->command->info('Email: R&BONESTOPMART@EMAIL.COM');
            $this->command->info('Password: R&BADMIN@20257');
            return;
        }

        // Create admin user
        User::create([
            'name' => 'R&B One Stop Mart Admin',
            'email' => 'R&BONESTOPMART@EMAIL.COM',
            'password' => Hash::make('R&BADMIN@20257'),
            'role' => 'admin',
            'phone' => null,
            'address' => null,
            'email_verified_at' => now(),
        ]);

        $this->command->info('Admin user created successfully!');
        $this->command->info('Email: R&BONESTOPMART@EMAIL.COM');
        $this->command->info('Password: R&BADMIN@20257');
    }
}