<?php

use App\Models\ProductOrderManifest;
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
            Schema::create('product_order_manifests', function (Blueprint $table) {
                $table->id();
                $table->foreignId("order_id")->nullable()->constrained(table: "product_orders")->nullOnDelete()->cascadeOnUpdate();
                $table->foreignId("source_station_id")->nullable()->constrained(table: "stations")->nullOnDelete()->cascadeOnUpdate();
                $table->string("shipping_status")->default(ProductOrderManifest::STATUS[0])->index();
                $table->unsignedDecimal("shipping_cost", 14, 2)->default(0);
                $table->timestamps();
            });
            Schema::table("product_transactions", function (Blueprint $table) {
                $table->foreignId("manifest_id")->nullable()->after("amount")->constrained(table: "product_order_manifests")->cascadeOnDelete()->cascadeOnUpdate();
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
                $table->dropForeign(["manifest_id"]);
                $table->dropColumn("manifest_id");
            });
        } catch (\Throwable $th) {
            $con = new ConsoleOutput();
            $con->writeln("Unable to drop order_id from product_transactions");
            $con->writeln("Either the column didn't exist or you have to drop it manually");
        }
        Schema::dropIfExists('product_order_manifests');
    }
};
