<?php

namespace App\Http\Controllers;

use App\Http\Requests\GeneralIndexRequest;
use App\Models\Product;
use App\Models\ProductStock;
use App\Models\Station;
use Illuminate\Http\Request;

class ProductStockController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(GeneralIndexRequest $request)
    {
        $productStockQuery = ProductStock::select(["*"]);

        if ($request->filled("search")) {
            $productStockQuery->where(function ($q) use ($request) {
                $q->whereRelation("product", "name", "like", "%" . $request->input("search") . "%")
                    ->orWhereRelation("station", "name", "like", "%" . $request->input("search") . "%")
                    ->orWhereRelation("station", "address", "like", "%" . $request->input("search") . "%");
            });
        }

        $productStockQuery->addSelect([
            "station_name" =>
            Station::whereColumn("stations.id", "product_stock.station_id")
                ->select(["name"])
                ->limit(1),
            "product_name" =>
            Product::whereColumn("products.id", "product_stock.product_id")
                ->select(["name"])
                ->limit(1),
            "unit" =>
            Product::whereColumn("products.id", "product_stock.product_id")
                ->select(["stock_unit"])
                ->limit(1),
        ]);

        [$sortColumn, $sortDirection] = explode(";", $request->input("order_by", "name;asc"));
        $productStockQuery->orderBy($sortColumn, $sortDirection);

        $productStocks = $productStockQuery->paginate($request->input("paginate", 25));

        if ($request->expectsJson()) {
            return response()->json($productStocks);
        }

        // TODO: Add valid intertia view for product transaction search/list
        // return Inertia::render("Items/Index", [
        //     "items" => $items,
        //     "search" => $request->input("search", ""),
        //     "order_by" => $request->input("order_by", "name;asc"),
        //     "page" => $request->input("page", 1),
        //     "paginate" => $request->input("paginate", 25),
        // ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // TODO: inertia form view
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $valid = $request->validate([
            "product_id" => "required|exists:products,id",
            "station_id" => "required|exists:stations,id",
        ]);

        $valid["id"] = $valid['product_id'] . "-" . $valid["station_id"];
        $productStock = ProductStock::create($valid);

        if ($request->expectsJson()) {
            return response()->json($productStock);
        }

        return to_route("product_stock.index");
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductStock $productStock)
    {
        // TODO: product stock detail inertia view
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductStock $productStock)
    {
        // TODO: product stock edit inertia view (probably the same one as for crete())
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProductStock $productStock)
    {
        // Do NOT directly update product stock
        // use product transaction to correct the stock amount instead
        abort(403);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductStock $productStock)
    {
        // Do NOT directly delete product stock
        // use product transaction to correct the stock amount instead
        abort(403);
    }
}
