<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductOrderManifestItem extends Model
{
    use HasFactory;

    protected $fillable = [
        "manifest_id",
        "product_id",
        "qty",
    ];

    public function manifest(): BelongsTo
    {
        return $this->belongsTo(ProductOrderManifest::class, "manifest_id", "id");
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, "product_id", "id");
    }
}
