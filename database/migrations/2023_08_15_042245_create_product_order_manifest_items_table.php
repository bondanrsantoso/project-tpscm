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
            Schema::create('product_order_manifest_items', function (Blueprint $table) {
                $table->id();
                $table->foreignId("manifest_id")->constrained(table: "product_order_manifests")->cascadeOnDelete()->cascadeOnUpdate();
                $table->foreignId("product_id")->nullable()->constrained(table: "products")->nullOnDelete()->cascadeOnUpdate();
                $table->unsignedInteger("qty");
                $table->timestamps();
            });

            DB::statement("DROP TRIGGER IF EXISTS add_product_transaction_on_order_manifest_insert;");
            DB::statement("
                CREATE TRIGGER add_product_transaction_on_order_manifest_insert
                AFTER INSERT on product_order_manifest_items
                FOR EACH ROW
                BEGIN
                    DECLARE man_station_id BIGINT UNSIGNED;

                    SELECT source_station_id INTO man_station_id
                        FROM product_order_manifests
                        WHERE product_order_manifests.id = NEW.manifest_id
                        LIMIT 1;

                    INSERT INTO product_transactions (
                        id,
                        product_id,
                        station_id,
                        amount,
                        manifest_id,
                        created_at,
                        updated_at
                    )
                        VALUES (
                            UUID(),
                            NEW.product_id,
                            man_station_id,
                            - NEW.qty,
                            NEW.manifest_id,
                            CURRENT_TIMESTAMP,
                            CURRENT_TIMESTAMP
                        );
                END
            ");

            DB::statement("DROP TRIGGER IF EXISTS update_product_transaction_on_order_manifest_update;");
            DB::statement("
                CREATE TRIGGER update_product_transaction_on_order_manifest_update
                AFTER UPDATE on product_order_manifest_items
                FOR EACH ROW
                BEGIN
                    DECLARE old_station_id BIGINT UNSIGNED;
                    DECLARE new_station_id BIGINT UNSIGNED;

                    SELECT source_station_id INTO old_station_id
                        FROM product_order_manifests
                        WHERE product_order_manifests.id = OLD.manifest_id
                        LIMIT 1;

                    SELECT source_station_id INTO new_station_id
                        FROM product_order_manifests
                        WHERE product_order_manifests.id = NEW.manifest_id
                        LIMIT 1;

                    DELETE FROM product_transactions
                        WHERE
                            station_id = old_station_id
                            AND product_id = OLD.product_id
                            AND manifest_id = OLD.manifest_id;

                    INSERT INTO product_transactions (
                        id,
                        product_id,
                        station_id,
                        amount,
                        manifest_id,
                        created_at,
                        updated_at
                    )
                        VALUES (
                            UUID(),
                            NEW.product_id,
                            new_station_id,
                            -NEW.qty,
                            NEW.manifest_id,
                            CURRENT_TIMESTAMP,
                            CURRENT_TIMESTAMP
                        );
                END
            ");

            DB::statement("DROP TRIGGER IF EXISTS delete_product_transaction_on_order_manifest_delete;");
            DB::statement("
                CREATE TRIGGER delete_product_transaction_on_order_manifest_delete
                AFTER DELETE on product_order_manifest_items
                FOR EACH ROW
                BEGIN
                    DECLARE man_station_id BIGINT UNSIGNED;

                    SELECT source_station_id INTO man_station_id
                        FROM product_order_manifests
                        WHERE product_order_manifests.id = OLD.manifest_id
                        LIMIT 1;

                    DELETE FROM product_transactions
                        WHERE
                            station_id = man_station_id
                            AND product_id = OLD.product_id
                            AND manifest_id = OLD.manifest_id;
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
        DB::statement("DROP TRIGGER IF EXISTS add_product_transaction_on_order_manifest_insert;");
        DB::statement("DROP TRIGGER IF EXISTS update_product_transaction_on_order_manifest_update;");
        DB::statement("DROP TRIGGER IF EXISTS delete_product_transaction_on_order_manifest_delete;");

        Schema::dropIfExists('product_order_manifest_items');
    }
};
