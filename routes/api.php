<?php

use App\Http\Controllers\MaterialController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductOrderController;
use App\Http\Controllers\ProductOrderManifestController;
use App\Http\Controllers\StationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::as("api")->resource("products", ProductController::class);
Route::as("api")->resource("stations", StationController::class);
Route::as("api")->resource("materials", MaterialController::class);

Route::as("api")->resource("product_orders", ProductOrderController::class);
Route::as("api")->resource("product_order_manifests", ProductOrderManifestController::class);
