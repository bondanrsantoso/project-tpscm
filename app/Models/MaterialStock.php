<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class MaterialStock extends Pivot
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        "id",
        "material_id",
        "station_id",
    ];

    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class, "material_id", "id");
    }

    public function station(): BelongsTo
    {
        return $this->belongsTo(Station::class, "station_id", "id");
    }
}
