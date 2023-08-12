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
            Schema::create('product_stock', function (Blueprint $table) {
                $table->string("id")->primary();
                $table->foreignId("product_id")->constrained(table: "products")->cascadeOnDelete()->cascadeOnUpdate();
                $table->foreignId("station_id")->constrained(table: "stations")->cascadeOnDelete()->cascadeOnUpdate();
                $table->decimal("amount", 14, 2)->default(0);
                $table->string("unit")->default("unit");
                $table->timestamps();
            });

            // Create stock sync on insert to product_transaction
            DB::statement("DROP TRIGGER IF EXISTS update_stock_after_transaction_insert;");
            DB::statement("
                CREATE TRIGGER update_stock_after_transaction_insert
                AFTER INSERT on product_transactions
                FOR EACH ROW
                BEGIN
                    DECLARE new_amount DECIMAL(14,2) DEFAULT NEW.amount;

                    INSERT INTO product_stock (
                        id,
                        product_id,
                        station_id,
                        amount,
                        unit,
                        created_at,
                        updated_at
                    )
                        VALUES (
                            CONCAT(NEW.product_id, '-', NEW.station_id),
                            NEW.product_id,
                            NEW.station_id,
                            new_amount,
                            NEW.unit,
                            CURRENT_TIMESTAMP,
                            CURRENT_TIMESTAMP
                        )
                    ON DUPLICATE KEY
                    UPDATE amount = amount + new_amount, updated_at = CURRENT_TIMESTAMP;
                END
            ");

            DB::statement("DROP TRIGGER IF EXISTS update_stock_after_transaction_delete;");
            DB::statement("
                CREATE TRIGGER update_stock_after_transaction_delete
                AFTER DELETE on product_transactions
                FOR EACH ROW
                BEGIN
                    DECLARE old_amount DECIMAL(14,2) DEFAULT OLD.amount;

                    UPDATE product_stock
                        SET
                            amount = amount - old_amount,
                            updated_at = CURRENT_TIMESTAMP
                        WHERE
                            station_id = OLD.station_id
                            AND product_id = OLD.product_id;

                END
            ");

            DB::statement("DROP TRIGGER IF EXISTS update_stock_after_transaction_update;");
            DB::statement("
                CREATE TRIGGER update_stock_after_transaction_update
                AFTER UPDATE on product_transactions
                FOR EACH ROW
                BEGIN
                    DECLARE old_amount DECIMAL(14,2) DEFAULT OLD.amount;
                    DECLARE new_amount DECIMAL(14,2) DEFAULT NEW.amount;

                    UPDATE product_stock
                        SET
                            amount = amount - old_amount + new_amount,
                            updated_at = CURRENT_TIMESTAMP
                        WHERE
                            station_id = OLD.station_id
                            AND product_id = OLD.product_id;

                END
            ");
        } catch (\Throwable $th) {
            $this->down();
            throw $th;
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP TRIGGER IF EXISTS update_stock_after_transaction_insert");
        DB::statement("DROP TRIGGER IF EXISTS update_stock_after_transaction_update");
        DB::statement("DROP TRIGGER IF EXISTS update_stock_after_transaction_delete");
        Schema::dropIfExists('product_stock');
    }
};
