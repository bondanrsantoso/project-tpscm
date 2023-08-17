<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Symfony\Component\Console\Output\ConsoleOutput;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        try {
            Schema::create('product_orders', function (Blueprint $table) {
                $table->id();
                $table->foreignId("user_id")->nullable()->constrained(table: "users")->nullOnDelete()->cascadeOnUpdate();
                $table->foreignId("destination_station_id")->nullable()->constrained(table: "stations")->nullOnDelete()->cascadeOnUpdate();
                $table->boolean("internal_order")->virtualAs("destination_station_id IS NOT NULL");
                $table->string("payment_status")->nullable();
                $table->unsignedDecimal("refunded_amount", 14, 2)->default(0);
                $table->timestamps();
            });

            Schema::table("product_transactions", function (Blueprint $table) {
                $table->foreignId("order_id")->nullable()->after("amount")->constrained(table: "product_orders")->cascadeOnDelete()->cascadeOnUpdate();
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
        try {
            Schema::table("product_transactions", function (Blueprint $table) {
                $table->dropForeign(["order_id"]);
                $table->dropColumn("order_id");
            });
        } catch (\Throwable $th) {
            $con = new ConsoleOutput();
            $con->writeln("\n\nUnable to drop order_id from product_transactions");
            $con->writeln("Either the column didn't exist or you have to drop it manually");
        }

        Schema::dropIfExists('product_orders');
    }
};
