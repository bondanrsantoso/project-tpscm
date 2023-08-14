<?php

namespace App\Http\Controllers;

use App\Http\Requests\GeneralIndexRequest;
use App\Models\Material;
use App\Models\MaterialStock;
use App\Models\Station;
use Illuminate\Http\Request;

class MaterialStockController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(GeneralIndexRequest $request)
    {
        $materialStockQuery = MaterialStock::select(["*"]);

        if ($request->filled("search")) {
            $materialStockQuery->where(function ($q) use ($request) {
                $q->whereRelation("material", "name", "like", "%" . $request->input("search") . "%")
                    ->orWhereRelation("station", "name", "like", "%" . $request->input("search") . "%")
                    ->orWhereRelation("station", "address", "like", "%" . $request->input("search") . "%");
            });
        }

        $materialStockQuery->addSelect([
            "station_name" =>
            Station::whereColumn("stations.id", "material_transactions.station_id")
                ->select(["name"])
                ->limit(1),
            "material_name" =>
            Material::whereColumn("materials.id", "material_transactions.material_id")
                ->select(["name"])
                ->limit(1),
            "unit" =>
            Material::whereColumn("materials.id", "material_transactions.material_id")
                ->select(["stock_unit"])
                ->limit(1),
        ]);

        [$sortColumn, $sortDirection] = explode(";", $request->input("order_by", "name;asc"));
        $materialStockQuery->orderBy($sortColumn, $sortDirection);

        $materialStocks = $materialStockQuery->paginate($request->input("paginate", 25));

        if ($request->expectsJson()) {
            return response()->json($materialStocks);
        }

        // TODO: Add valid intertia view for material transaction search/list
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
            "material_id" => "required|exists:materials,id",
            "station_id" => "required|exists:stations,id",
        ]);

        $valid["id"] = $valid['material_id'] . "-" . $valid["station_id"];
        $materialStock = MaterialStock::create($valid);

        if ($request->expectsJson()) {
            return response()->json($materialStock);
        }

        return to_route("material_stock.index");
    }

    /**
     * Display the specified resource.
     */
    public function show(MaterialStock $materialStock)
    {
        // TODO: material stock detail inertia view
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MaterialStock $materialStock)
    {
        // TODO: material stock edit inertia view (probably the same one as for crete())
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MaterialStock $materialStock)
    {
        // Do NOT directly update material stock
        // use material transaction to correct the stock amount instead
        abort(403);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MaterialStock $materialStock)
    {
        // Do NOT directly delete material stock
        // use material transaction to correct the stock amount instead
        abort(403);
    }
}
