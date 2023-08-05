<?php

namespace Database\Seeders;

use App\Models\Station;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $count = 10;

        $stationChunk = [];

        for ($i = 0; $i < $count; $i++) {
            $type = Station::TYPE[rand(0, 1)];
            $stationChunk[] = [
                "name" => strtoupper(fake()->word()) . " " . $type,
                "description" => fake()->realText(),
                "address" => fake("id_ID")->address(),
                "type" => $type,
                "lat" => fake()->randomFloat(2, -11, 6),
                "lng" => fake()->randomFloat(2, 95, 141),
            ];
        }

        Station::insert($stationChunk);
    }
}
