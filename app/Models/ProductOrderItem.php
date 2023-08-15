<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductOrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        "order_id",
        "product_id",
        "requested_qty",
        "received_qty",
        "base_subtotal",
        "billed_subtotal",
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(ProductOrder::class, "order_id", "id");
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, "product_id", "id");
    }
}
