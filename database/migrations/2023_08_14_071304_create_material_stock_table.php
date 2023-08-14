<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        try {
            Schema::create('material_stock', function (Blueprint $table) {
                $table->string("id")->primary();
                $table->foreignId("material_id")->constrained(table: "materials")->cascadeOnDelete()->cascadeOnUpdate();
                $table->foreignId("station_id")->constrained(table: "stations")->cascadeOnDelete()->cascadeOnUpdate();
                $table->decimal("amount", 14, 2)->default(0);
                $table->timestamps();
            });

            // Create stock sync on insert to product_transaction
            DB::statement("DROP TRIGGER IF EXISTS update_material_stock_after_transaction_insert;");
            DB::statement("
                CREATE TRIGGER update_material_stock_after_transaction_insert
                AFTER INSERT on material_transactions
                FOR EACH ROW
                BEGIN
                    DECLARE new_amount DECIMAL(14,2) DEFAULT NEW.amount;

                    INSERT INTO material_stock (
                        id,
                        material_id,
                        station_id,
                        amount,
                        created_at,
                        updated_at
                    )
                        VALUES (
                            CONCAT(NEW.material_id, '-', NEW.station_id),
                            NEW.material_id,
                            NEW.station_id,
                            new_amount,
                            CURRENT_TIMESTAMP,
                            CURRENT_TIMESTAMP
                        )
                    ON DUPLICATE KEY
                    UPDATE amount = amount + new_amount, updated_at = CURRENT_TIMESTAMP;
                END
            ");

            DB::statement("DROP TRIGGER IF EXISTS update_material_stock_after_transaction_delete;");
            DB::statement("
                CREATE TRIGGER update_material_stock_after_transaction_delete
                AFTER DELETE on material_transactions
                FOR EACH ROW
                BEGIN
                    DECLARE old_amount DECIMAL(14,2) DEFAULT OLD.amount;

                    UPDATE material_stock
                        SET
                            amount = amount - old_amount,
                            updated_at = CURRENT_TIMESTAMP
                        WHERE
                            station_id = OLD.station_id
                            AND material_id = OLD.material_id;

                END
            ");

            DB::statement("DROP TRIGGER IF EXISTS update_material_stock_after_transaction_update;");
            DB::statement("
                CREATE TRIGGER update_material_stock_after_transaction_update
                AFTER UPDATE on material_transactions
                FOR EACH ROW
                BEGIN
                    DECLARE old_amount DECIMAL(14,2) DEFAULT OLD.amount;
                    DECLARE new_amount DECIMAL(14,2) DEFAULT NEW.amount;

                    UPDATE material_stock
                        SET
                            amount = amount - old_amount + new_amount,
                            updated_at = CURRENT_TIMESTAMP
                        WHERE
                            station_id = OLD.station_id
                            AND material_id = OLD.material_id;

                END
            ");
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('material_stock');
        DB::statement("DROP TRIGGER IF EXISTS update_material_stock_after_transaction_insert;");
        DB::statement("DROP TRIGGER IF EXISTS update_material_stock_after_transaction_delete;");
        DB::statement("DROP TRIGGER IF EXISTS update_material_stock_after_transaction_update;");
    }
};
