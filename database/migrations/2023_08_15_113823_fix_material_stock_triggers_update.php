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
                            amount = amount - old_amount,
                            updated_at = CURRENT_TIMESTAMP
                        WHERE
                            station_id = OLD.station_id
                            AND material_id = OLD.material_id;

                    UPDATE material_stock
                        SET
                            amount = amount + new_amount,
                            updated_at = CURRENT_TIMESTAMP
                        WHERE
                            station_id = NEW.station_id
                            AND material_id = NEW.material_id;
                END
            ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
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
    }
};
