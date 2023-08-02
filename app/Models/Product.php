<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
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
}
