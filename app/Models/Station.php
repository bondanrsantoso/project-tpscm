<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Station extends Model
{
    use HasFactory;

    const TYPE = [
        "warehouse",
        "plant",
    ];

    protected $fillable = [
        "name",
        "description",
        "address",
        "type",
        "lat",
        "lng",
    ];

    public function productStocks(): HasMany
    {
        return $this->hasMany(ProductStock::class, "station_id", "id");
    }

    public function productTransactions(): HasMany
    {
        return $this->hasMany(ProductTransaction::class, "station_id", "id");
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(
            Product::class,
            "product_stock",
            "station_id",
            "product_id",
            "id",
            "id"
        )->withPivot(["amount"])->as("stock");
    }

    public function materialStocks(): HasMany
    {
        return $this->hasMany(MaterialStock::class, "station_id", "id");
    }

    public function materialTransactions(): HasMany
    {
        return $this->hasMany(MaterialTransaction::class, "station_id", "id");
    }

    public function materials(): BelongsToMany
    {
        return $this->belongsToMany(
            Material::class,
            "material_stock",
            "station_id",
            "material_id",
            "id",
            "id"
        )->withPivot(["amount"])->as("stock");
    }
}
