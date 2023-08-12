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
        Schema::create('product_transactions', function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->foreignId("product_id")->constrained(table: "products")->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId("station_id")->constrained(table: "stations")->cascadeOnDelete()->cascadeOnUpdate();
            $table->enum("type", ["IN", "OUT"])->storedAs("IF(amount < 0, 'OUT', 'IN')");
            $table->boolean("is_correction")->default(false);
            $table->decimal("amount", 14, 2);
            $table->string("unit")->default("unit");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_transactions');
    }
};
