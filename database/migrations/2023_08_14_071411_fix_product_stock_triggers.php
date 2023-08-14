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
                        created_at,
                        updated_at
                    )
                        VALUES (
                            CONCAT(NEW.product_id, '-', NEW.station_id),
                            NEW.product_id,
                            NEW.station_id,
                            new_amount,
                            CURRENT_TIMESTAMP,
                            CURRENT_TIMESTAMP
                        )
                    ON DUPLICATE KEY
                    UPDATE amount = amount + new_amount, updated_at = CURRENT_TIMESTAMP;
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
        DB::statement("DROP TRIGGER IF EXISTS update_stock_after_transaction_insert;");
    }
};
