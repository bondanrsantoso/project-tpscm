<?php

namespace App\Http\Controllers;

use App\Http\Requests\GeneralIndexRequest;
use App\Models\Material;
use App\Models\MaterialTransaction;
use App\Models\Station;
use Illuminate\Http\Request;

class MaterialTransactionController extends Controller
{
    public function index(GeneralIndexRequest $request)
    {
        $materialTransactionQuery = MaterialTransaction::select(["*"]);

        if ($request->filled("search")) {
            $materialTransactionQuery->where(function ($q) use ($request) {
                $q->whereRelation("material", "name", "like", "%" . $request->input("search") . "%")
                    ->orWhereRelation("station", "name", "like", "%" . $request->input("search") . "%")
                    ->orWhereRelation("station", "address", "like", "%" . $request->input("search") . "%");
            });
        }

        $materialTransactionQuery->addSelect([
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
        $materialTransactionQuery->orderBy($sortColumn, $sortDirection);

        $materialTransactions = $materialTransactionQuery->paginate($request->input("paginate", 25));

        if ($request->expectsJson()) {
            return response()->json($materialTransactions);
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
            "is_correction" => "required|boolean",
            "amount" => "required|numeric",
        ]);

        $materialTransaction = MaterialTransaction::create($valid);

        if ($request->expectsJson()) {
            return response()->json($materialTransaction);
        }

        return to_route("material_transactions.index");
    }

    /**
     * Display the specified resource.
     */
    public function show(MaterialTransaction $materialTransaction)
    {
        $materialTransaction->load([
            "material",
            "station"
        ]);
        // TODO: material transaction detail inertia view
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MaterialTransaction $materialTransaction)
    {
        $materialTransaction->load([
            "material",
            "station"
        ]);
        // TODO: material transaction edit inertia view (probably the same one as for crete())
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MaterialTransaction $materialTransaction)
    {
        $valid = $request->validate([
            "material_id" => "sometimes|required|exists:materials,id",
            "station_id" => "sometimes|required|exists:stations,id",
            "is_correction" => "sometimes|required|boolean",
            "amount" => "sometimes|required|numeric",
        ]);

        $materialTransaction->fill($valid);
        $materialTransaction->save();

        if ($request->expectsJson()) {
            return response()->json($materialTransaction);
        }

        return to_route("material_transactions.index");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, MaterialTransaction $materialTransaction)
    {
        $materialTransaction->delete();

        if ($request->expectsJson()) {
            return response()->json($materialTransaction);
        }

        return to_route("material_transactions.index");
    }
}
