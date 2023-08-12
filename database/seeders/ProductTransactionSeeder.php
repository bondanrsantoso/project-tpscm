<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductTransaction;
use App\Models\Station;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class ProductTransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $transactions = [];
        $chunkSize = 25;
        $transactionAmount = 1000;

        if (app()->isProduction()) {
            return;
        } else {
            Schema::disableForeignKeyConstraints();
            DB::table("product_stock")->truncate();
            DB::table("product_transactions")->truncate();
            Schema::enableForeignKeyConstraints();
        }

        try {
            DB::beginTransaction();

            $stocks = [];
            $productIds = Product::select(["id"])->get()->pluck("id");
            $stationIds = Station::select(["id"])->get()->pluck("id");

            for ($i = 0; $i < $transactionAmount; $i++) {
                $productId = $productIds->random();
                $stationId = $stationIds->random();

                $stock = $stocks[$productId . "-" . $stationId] ?? 0;

                $insertedAmount = $stock > 0 ? rand(-$stock, 1000) : rand(15, 1000);

                if ($insertedAmount < 0 && abs($insertedAmount) > $stock) {
                    $insertedAmount = -$stock;
                }

                $transaction[] = [
                    "id" => Str::uuid(),
                    "product_id" => $productIds->random(),
                    "station_id" => $stationIds->random(),
                    "is_correction" => false,
                    "amount" => $insertedAmount,
                    "unit" => "unit",
                ];

                if (isset($stocks[$productId . "-" . $stationId])) {
                    $stocks[$productId . "-" . $stationId] += $insertedAmount;
                } else {
                    $stocks[$productId . "-" . $stationId] = $insertedAmount;
                }

                if (sizeof($transaction) === $chunkSize) {
                    ProductTransaction::insert($transaction);
                    $transaction = [];
                }
            }

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }
}
