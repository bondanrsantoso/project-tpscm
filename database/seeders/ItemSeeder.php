<?php

namespace Database\Seeders;

use App\Models\Item;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $itemCount = 250;
        $chunk = 5;

        $itemChunk = [];

        try {
            if (env("APP_DEBUG", false)) {
                Schema::disableForeignKeyConstraints();
                DB::table("items")->truncate();
                Schema::enableForeignKeyConstraints();
            }


            DB::beginTransaction();
            for ($i = 0; $i < $itemCount; $i++) {
                $itemChunk[] = [
                    "name" => fake()->company() . " " . fake()->word(),
                    "description" => fake()->realText(),
                    "image_url" => "https://placehold.co/200x200",
                    "weight" => fake()->randomFloat(2, 0, 30),
                    "width" => rand(1, 200),
                    "height" => rand(1, 200),
                    "depth" => rand(1, 200),
                    "value" => rand(50, 10000) * 1000,
                ];

                if (sizeof($itemChunk) % $chunk === 0) {
                    Item::insert($itemChunk);
                    $itemChunk = [];
                }
            }

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }
}
