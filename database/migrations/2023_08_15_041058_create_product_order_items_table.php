<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('product_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId("order_id")->constrained(table: "product_orders")->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId("product_id")->nullable()->constrained(table: "products")->nullOnDelete()->cascadeOnUpdate();
            $table->unsignedInteger("requested_qty");
            $table->unsignedInteger("received_qty")->default(0);
            $table->unsignedDecimal("base_subtotal", 14, 2);
            $table->unsignedDecimal("billed_subtotal", 14, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_order_items');
    }
};
