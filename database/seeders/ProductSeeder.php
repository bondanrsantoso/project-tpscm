<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $brands = [
            "Nooie",
            "YI",
            "Reolink",
            "Amcrest",
            "HeimVision",
            "Zmodo",
            "ANNKE",
            "Lorex",
            "Swann",
            "Night Owl",
            "Defender",
            "Q-See",
            "LaView",
            "GW Security",
            "Hikvision"
        ];

        $brandSKU = [
            "NOO",
            "YI",
            "REO",
            "AMC",
            "HEI",
            "ZMO",
            "ANN",
            "LOR",
            "SWA",
            "NIG",
            "DEF",
            "QSE",
            "LAV",
            "GWS",
            "HIK"
        ];

        $variantsName = [
            "Pro",
            "Max",
            "Mini",
            "Lite",
            "Ultra",
            "Plus",
            "Elite",
            "Prime",
            "Advance",
            "Extreme",
            "Fusion",
            "Turbo",
            "Velocity",
            "Force",
            "Power",
            "Energy",
            "Momentum",
            "Quantum",
            "Infinity",
            "Zenith",
            "Apex",
            "Summit",
            "Pinnacle",
            "Vertex",
            "Crest",
            "Peak",
            "Crown",
            "Topper",
            "Capstone",
            "Climax",
            "Culmination",
            "Acme",
            "Zenith Plus",
            "Apex Pro",
            "Summit Max",
            "Pinnacle Mini",
            "Vertex Lite",
            "Crest Ultra",
            "Peak Plus",
            "Crown Elite",
            "Topper Prime",
            "Capstone Advance",
            "Climax Extreme",
            "Culmination Fusion",
            "Acme Turbo",
        ];

        $anotherVariants = [
            "1000",
            "2000",
            "3000",
            "4000",
            "5000",
            "6000",
            "7000",
            "8000",
            "9000",
            "X1",
            "X2",
            "X3",
            "X4",
            "X5",
            "X6",
            "X7",
            "X8",
            "X9",
            "X10",
            "Y1",
            "Y2",
            "Y3",
            "Y4",
            "Y5",
            "Y6",
            "Y7",
            "Y8",
            "Y9",
            "Y10",
            "A1",
            "A2",
            "A3",
            "A4",
            "A5",
            "A6",
            "A7",
            "A8",
            "A9",
            "A10",
            "Z1",
            "Z2",
            "Z3",
            "Z4",
            "Z5",
            "Z6",
            "Z7",
            "Z8",
            "Z9",
            "Z10",
        ];

        if (app()->isProduction()) {
            return;
        } else {
            Schema::disableForeignKeyConstraints();
            DB::table("products")->truncate();
            Schema::enableForeignKeyConstraints();
        }


        $productCount = 1000;
        $chunk = 50;

        $productChunk = [];
        for ($i = 0; $i < $productCount; $i++) {
            $brandSeed = rand(0, sizeof($brands) - 1);
            $modelName = fake()->randomElement($variantsName);
            $variant = fake()->randomElement($anotherVariants);

            $modelWords = explode(" ", $modelName);
            $modelSKU = "";

            foreach ($modelWords as $word) {
                $modelSKU .= strtoupper(substr($word, 0, 3));
            }

            $sku = implode("-", [
                $brandSKU[$brandSeed],
                $modelSKU,
                strtoupper($variant)
            ]);

            $netWeight = rand(5, 500) * 10; //grams
            $tareWeight = rand(10, 30) * $netWeight / 100;

            $productChunk[] = [
                "sku" => $sku,
                "brand" => $brands[$brandSeed],
                "variants" => $modelName . " " . $variant,
                "description" => fake()->realText(),
                "image_url" => "https://placehold.co/1024x1024/000000/FFFFFF.png?text=Product",
                "net_weight" => $netWeight,
                "gross_weight" => $netWeight + $tareWeight,
                "tare_weight" => $tareWeight,
                "width" => rand(5, 70) * 10,
                "height" => rand(20, 50) * 10,
                "depth" => rand(8, 50),
                "base_value" => rand(800, 40000) * 1000,
            ];

            if (sizeof($productChunk) % $chunk  === 0) {
                try {
                    DB::beginTransaction();
                    Product::insert($productChunk);
                    DB::commit();
                } catch (\Throwable $th) {
                    DB::rollBack();
                    $i -= $chunk;
                    // throw $th;
                } finally {
                    $productChunk = [];
                }
            }
        }
    }
}
