<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductOrder;
use App\Models\ProductOrderItem;
use App\Models\ProductTransaction;
use App\Models\Station;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ProductOrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $orderCount = 100;

        if (!app()->isProduction()) {
            ProductTransaction::whereNotNull("manifest_id")
                ->orWhereNotNull("order_id")
                ->delete();

            Schema::disableForeignKeyConstraints();
            DB::table("product_order_items")->truncate();
            DB::table("product_order_manifest_items")->truncate();
            DB::table("product_order_manifests")->truncate();
            DB::table("product_orders")->truncate();
            Schema::enableForeignKeyConstraints();
        }

        try {
            DB::beginTransaction();
            $users = User::select(["id"])->get();
            $stations = Station::select(["id"])->get();
            $products = Product::with(["stations"])->get()->keyBy("id");

            for ($i = 0; $i < $orderCount; $i++) {
                $selectedProducts = $products->random(rand(3, 15));
                $externalRequest = rand(0, 100) > 80;

                /**
                 * @var ProductOrder
                 */
                $order = ProductOrder::create([
                    "user_id" => $users->random()->id,
                    "destination_station_id" => $externalRequest ? null : $stations->random()->id,
                    "payment_status" => ProductOrder::PAYMENT_STATUS[rand(0, 2)],
                    "refunded_amount" => 0,
                ]);

                $expectedOrderQty = collect();
                foreach ($selectedProducts as $product) {
                    $orderedQty = rand(5, 100);
                    // $receivedQty = (rand(8, 10) / 10) * $orderedQty;
                    $baseSubtotal = $product->base_value * $orderedQty;
                    /**
                     * @var ProductOrderItem
                     */
                    $item = $order->items()->create([
                        "product_id" => $product->id,
                        "requested_qty" => $orderedQty,
                        "received_qty" => 0,
                        "base_subtotal" => $baseSubtotal,
                        "billed_subtotal" => $externalRequest ? 1.2 * $baseSubtotal : 0,
                    ]);

                    // $expectedOrderQty->put($product->id, [
                    //     "product_id" => $product->id,
                    //     "expected" => $receivedQty,
                    //     "fulfilled" => 0,
                    // ]);
                }

                // /**
                //  * @var Collection<mixed, Station>
                //  */
                // $fulfillmentStations = $selectedProducts
                //     ->map(fn ($product) => $product->stations)
                //     ->flatten()
                //     ->keyBy("id");

                // foreach ($fulfillmentStations as $station) {
                //     $productIds = $exp
                //     $products = $station->products()
                //         ->wherePivot("amount", ">", 0)
                //         ->whereIn($expectedOrderQty->keys())
                //         ->get();
                // }
            }
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }
}
