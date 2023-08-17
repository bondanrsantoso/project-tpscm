<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Material extends Model
{
    use HasFactory;

    protected $fillable = [
        "sku",
        "brand",
        "variants",
        "description",
        "image_url",
        "net_weight",
        "gross_weight",
        "tare_weight",
        "width",
        "height",
        "depth",
        "base_value",
        "stock_unit",
    ];

    protected $casts = [
        "net_weight" => "float",
        "gross_weight" => "float",
        "tare_weight" => "float",
        "width" => "float",
        "height" => "float",
        "depth" => "float",
        "volume" => "float",
        "base_value" => "float",
    ];

    public function stocks(): HasMany
    {
        return $this->hasMany(MaterialStock::class, "material_id", "id");
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(MaterialTransaction::class, "material_id", "id")->orderBy("created_at", "desc");
    }

    public function stations(): BelongsToMany
    {
        return $this->belongsToMany(
            Station::class,
            "material_stock",
            "material_id",
            "station_id",
            "id",
            "id"
        )->withPivot(["amount"])->as("stock");
    }
}
