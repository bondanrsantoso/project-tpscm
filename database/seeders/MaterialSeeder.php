<?php

namespace Database\Seeders;

use App\Models\Material;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class MaterialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $brands = [
            "Nvidia",
            "AMD",
            "Qualcomm",
            "Intel Corporation",
            "Micron Technology",
            "Broadcom Inc.",
            "II-VI Inc.",
            "Advantest",
            "Moov Technologies",
            "TSMC",
        ];

        if (app()->isProduction()) {
            return;
        } else {
            Schema::disableForeignKeyConstraints();
            DB::table("materials")->truncate();
            Schema::enableForeignKeyConstraints();
        }


        $materialCount = 1000;
        $chunk = 50;

        $materialChunk = [];
        for ($i = 0; $i < $materialCount; $i++) {
            $brand = $brands[rand(0, sizeof($brands) - 1)];
            $modelName = fake()->regexify("[A-Z]{" . rand(1, 3) . "}[0-9]{" . rand(3, 5) . "}[A-Z]{" . rand(0, 3) . "}");

            $sku = implode("-", [
                strtoupper(substr(preg_replace("/[^A-Za-z0-9]/i", "", $brand), 0, 3)),
                $modelName,
            ]);

            $netWeight = rand(5, 500); //grams
            $tareWeight = rand(10, 30) * $netWeight / 100;

            $materialChunk[] = [
                "sku" => $sku,
                "brand" => $brand,
                "variants" => $modelName,
                "description" => fake()->realText(),
                "image_url" => "https://placehold.co/1024x1024/000000/FFFFFF.png?text=Material",
                "net_weight" => $netWeight,
                "gross_weight" => $netWeight + $tareWeight,
                "tare_weight" => $tareWeight,
                "width" => rand(5, 70) * 10,
                "height" => rand(20, 50) * 10,
                "depth" => rand(8, 50),
                "base_value" => rand(800, 40000) * 1000,
                "stock_unit" => fake()->randomElement(["unit", "pcs"]),
            ];

            if (sizeof($materialChunk) % $chunk  === 0) {
                try {
                    DB::beginTransaction();
                    Material::insert($materialChunk);
                    DB::commit();
                } catch (\Throwable $th) {
                    DB::rollBack();
                    $i -= $chunk;
                    // throw $th;
                } finally {
                    $materialChunk = [];
                }
            }
        }
    }
}
