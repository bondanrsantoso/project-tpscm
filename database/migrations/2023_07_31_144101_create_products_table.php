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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string("sku", 36)->unique();
            $table->string("brand");
            $table->string("variants");
            $table->string("name")->storedAs("CONCAT(brand, ' ', variants)");
            $table->string("description");
            $table->text("image_url")->nullable();
            $table->decimal("net_weight", 12, 2)->comment("in grams");
            $table->decimal("gross_weight", 12, 2)->comment("in grams");
            $table->decimal("tare_weight", 12, 2)->comment("in grams");
            $table->decimal("width", 15, 2)->comment("in mm");
            $table->decimal("height", 15, 2)->comment("in mm");
            $table->decimal("depth", 15, 2)->comment("in mm");
            $table->decimal("volume", 15, 2)->storedAs("width * height * depth")->comment("in mm");
            $table->decimal("base_value", 12, 2)->comment("in IDR, commonly known as HPP in Indonesian");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
