<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, change the column to VARCHAR to allow any values
        DB::statement("ALTER TABLE orders MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'pending'");
        
        // Update existing records with old status values to new ones
        DB::statement("UPDATE orders SET status = 'start_preparing' WHERE status = 'preparing'");
        DB::statement("UPDATE orders SET status = 'mark_ready' WHERE status = 'ready'");
        
        // Now change it back to ENUM with all the new values
        DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM('pending', 'confirmed', 'start_preparing', 'mark_ready', 'out_for_delivery', 'delivered', 'processed', 'cancelled') NOT NULL DEFAULT 'pending'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Change to VARCHAR first
        DB::statement("ALTER TABLE orders MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'pending'");
        
        // Revert status values back to old ones
        DB::statement("UPDATE orders SET status = 'preparing' WHERE status = 'start_preparing'");
        DB::statement("UPDATE orders SET status = 'ready' WHERE status = 'mark_ready'");
        
        // Revert to original ENUM
        DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending'");
    }
};