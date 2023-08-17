<?php

use App\Http\Controllers\ItemController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\MaterialStockController;
use App\Http\Controllers\MaterialTransactionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductStockController;
use App\Http\Controllers\ProductTransactionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    // return Inertia::render('Welcome', [
    //     'canLogin' => Route::has('login'),
    //     'canRegister' => Route::has('register'),
    //     'laravelVersion' => Application::VERSION,
    //     'phpVersion' => PHP_VERSION,
    // ]);

    return to_route("dashboard");
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource("items", ItemController::class)->middleware(["upload:image,image_url"]);
    Route::resource("products", ProductController::class)->middleware(["upload:image,image_url"]);
    Route::resource("materials", MaterialController::class)->middleware(["upload:image,image_url"]);
    Route::resource("stations", StationController::class)->middleware(["upload:image,image_url"]);

    Route::resource("product_transactions", ProductTransactionController::class);
    Route::resource("product_stock", ProductStockController::class)
        ->except(["update", "destroy"]);

    Route::resource("material_transactions", MaterialTransactionController::class);
    Route::resource("material_stock", MaterialStockController::class)
        ->except(["update", "destroy"]);

    Route::resource("product_orders", ProductOrderController::class);
});

require __DIR__ . '/auth.php';
