<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductTransaction extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        "id",
        "product_id",
        "station_id",
        "is_correction",
        "amount",
    ];

    protected $casts = [
        "amount" => "float",
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, "product_id", "id");
    }

    public function station(): BelongsTo
    {
        return $this->belongsTo(Station::class, "station_id", "id");
    }
}
