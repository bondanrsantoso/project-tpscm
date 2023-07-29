<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\Console\Output\ConsoleOutput;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        try {
            DB::beginTransaction();
            $con = new ConsoleOutput();

            if (env("APP_DEBUG", false)) {
                $con->writeln("Removing existing admin account...");
                User::where("email", "admin@admin.com")->delete();
            }
            $words = [];

            for ($i = 0; $i < 50; $i++) {
                $cityName = fake("id_ID")->city();
                if (preg_match("/\s/", $cityName)) {
                    $i--;
                    continue;
                }
                $words[] = $cityName;
            }

            $password = implode("-", fake()->randomElements($words, 4));
            $admin = User::create([
                "name" => "admin",
                "email" => "admin@admin.com",
                "password" => Hash::make($password),
            ]);

            $con->writeln("New Admin credential: ");
            $con->writeln("email: {$admin->email}");
            $con->writeln("password: {$password}");

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }
}
