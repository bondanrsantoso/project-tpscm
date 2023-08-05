<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}
