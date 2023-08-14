<?php

namespace Database\Seeders;

use App\Models\Material;
use App\Models\MaterialTransaction;
use App\Models\Station;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class MaterialTransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $transactions = [];
        $chunkSize = 100;
        $transactionAmount = 10000;

        if (app()->isProduction()) {
            return;
        } else {
            Schema::disableForeignKeyConstraints();
            DB::table("material_stock")->truncate();
            DB::table("material_transactions")->truncate();
            Schema::enableForeignKeyConstraints();
        }

        try {
            DB::beginTransaction();

            $stocks = [];
            $materialIds = Material::select(["id"])->get()->pluck("id");
            $stationIds = Station::select(["id"])->get()->pluck("id");

            for ($i = 0; $i < $transactionAmount; $i++) {
                $materialId = $materialIds->random();
                $stationId = $stationIds->random();


                $insertedAmount = rand(1, 1000);

                $transaction[] = [
                    "id" => Str::uuid(),
                    "material_id" => $materialIds->random(),
                    "station_id" => $stationIds->random(),
                    "is_correction" => false,
                    "amount" => $insertedAmount,
                ];

                if (isset($stocks[$materialId . "-" . $stationId])) {
                    $stocks[$materialId . "-" . $stationId] += $insertedAmount;
                } else {
                    $stocks[$materialId . "-" . $stationId] = $insertedAmount;
                }

                if (sizeof($transaction) === $chunkSize) {
                    MaterialTransaction::insert($transaction);
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
