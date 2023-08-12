<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string("stock_unit")->default("unit")->after("base_value");
        });
        Schema::table('product_transactions', function (Blueprint $table) {
            $table->dropColumn("unit");
        });
        Schema::table('product_stock', function (Blueprint $table) {
            $table->dropColumn("unit");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn("stock_unit");
        });
        Schema::table('product_stock', function (Blueprint $table) {
            $table->string("unit")->default("unit")->after("amount");
        });
        Schema::table('product_transactions', function (Blueprint $table) {
            $table->string("unit")->default("unit")->after("amount");
        });
    }
};
