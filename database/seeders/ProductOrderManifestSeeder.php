<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductOrder;
use App\Models\ProductOrderItem;
use App\Models\Station;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ProductOrderManifestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        try {
            if (!app()->isProduction()) {
                Schema::disableForeignKeyConstraints();
                DB::table("product_order_manifest_items")->truncate();
                DB::table("product_order_manifests")->truncate();
                Schema::enableForeignKeyConstraints();
            }

            /**
             * @var Collection<int, Station>
             */
            $stations = Station::whereRelation("stocks", "amount", ">", 0)->get();

            // /**
            //  * @var Collection<int, ProductOrder>
            //  */
            // $orders = ProductOrder::with(["items"])->get();

            foreach ($stations as $station) {
                $inStockProducts = $station
                    ->products()
                    ->wherePivot("amount", ">", 0)
                    ->get()
                    ->keyBy("id");

                $productStock = $inStockProducts
                    ->map(fn ($product) => $product->stock)
                    ->keyBy("product_id");

                $orders = ProductOrder::whereRelationIn("items", "id", $inStockProducts->pluck("id")->all())
                    ->whereRelation("items", "received_qty", "=", 0)
                    ->get();

                // $servedOrders = 0
                // while($productStock->sum("amount") > 0){

                // }
            }
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }
}
