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
        try {
            Schema::create('material_transactions', function (Blueprint $table) {
                $table->uuid("id")->primary();
                $table->foreignId("material_id")->constrained(table: "materials")->cascadeOnDelete()->cascadeOnUpdate();
                $table->foreignId("station_id")->constrained(table: "stations")->cascadeOnDelete()->cascadeOnUpdate();
                $table->enum("type", ["IN", "OUT"])->storedAs("IF(amount < 0, 'OUT', 'IN')");
                $table->boolean("is_correction")->default(false);
                $table->decimal("amount", 14, 2);
                $table->timestamps();
            });
        } catch (\Throwable $th) {
            $this->down();
            throw $th;
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('material_transactions');
    }
};
