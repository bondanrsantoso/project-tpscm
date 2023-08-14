<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaterialTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        "id",
        "material_id",
        "station_id",
        "is_correction",
        "amount",
    ];

    protected $casts = [
        "amount" => "float",
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
