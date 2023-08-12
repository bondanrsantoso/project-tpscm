<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ProductStock extends Pivot
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        "id",
        "product_id",
        "station_id",
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
