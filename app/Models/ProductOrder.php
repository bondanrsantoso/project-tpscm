<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductOrder extends Model
{
    use HasFactory;

    const PAYMENT_STATUS = [
        "pending",
        "charged",
        "paid",
        "refunded",
        "partial_refund"
    ];

    protected $fillable = [
        "user_id",
        "destination_station_id",
        "payment_status",
        "refunded_amount",
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, "user_id", "id");
    }

    public function destinationStation(): BelongsTo
    {
        return $this->belongsTo(Station::class, "destination_station_id", "id");
    }

    public function items(): HasMany
    {
        return $this->hasMany(ProductOrderItem::class, "order_id", "id");
    }

    public function manifests(): HasMany
    {
        return $this->hasMany(ProductOrderManifest::class, "order_id", "id");
    }
}
