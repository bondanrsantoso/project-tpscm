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
                            amount = amount - old_amount,
                            updated_at = CURRENT_TIMESTAMP
                        WHERE
                            station_id = OLD.station_id
                            AND product_id = OLD.product_id;

                    UPDATE product_stock
                        SET
                            amount = amount + new_amount,
                            updated_at = CURRENT_TIMESTAMP
                        WHERE
                            station_id = NEW.station_id
                            AND product_id = NEW.product_id;

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
    }
};
