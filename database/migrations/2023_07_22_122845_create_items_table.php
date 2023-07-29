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
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->text("description");
            $table->text("image_url");
            $table->unsignedDecimal("weight", 12, 2)->comment("weight in kg");
            $table->unsignedInteger("width")->comment("in cm");
            $table->unsignedInteger("height")->comment("in cm");
            $table->unsignedInteger("depth")->comment("in cm");
            $table->unsignedInteger("value")->comment("cargo value in IDR");
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
