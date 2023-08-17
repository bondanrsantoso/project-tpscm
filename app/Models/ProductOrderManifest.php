<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductOrderManifest extends Model
{
    use HasFactory;

    const STATUS = [
        "pending",
        "sent",
        "received",
        "finished",
        "returned",
        "canceled",
        "discarded",
    ];

    protected $fillable = [
        "order_id",
        "source_station_id",
        "shipping_status",
        "shipping_cost",
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(ProductOrder::class, "order_id", "id");
    }

    public function sourceStation(): BelongsTo
    {
        return $this->belongsTo(Station::class, "source_station_id", "id");
    }

    public function items(): HasMany
    {
        return $this->hasMany(ProductOrderManifestItem::class, "manifest_id", "id");
    }
}
