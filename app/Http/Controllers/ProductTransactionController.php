<?php

namespace App\Http\Controllers;

use App\Http\Requests\GeneralIndexRequest;
use App\Models\Product;
use App\Models\ProductTransaction;
use App\Models\Station;
use Illuminate\Contracts\Database\Query\Builder;
use Illuminate\Http\Request;

class ProductTransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(GeneralIndexRequest $request)
    {
        $productTransactionQuery = ProductTransaction::select(["*"]);

        if ($request->filled("search")) {
            $productTransactionQuery->where(function ($q) use ($request) {
                $q->whereRelation("product", "name", "like", "%" . $request->input("search") . "%")
                    ->orWhereRelation("station", "name", "like", "%" . $request->input("search") . "%")
                    ->orWhereRelation("station", "address", "like", "%" . $request->input("search") . "%");
            });
        }

        $productTransactionQuery->addSelect([
            "station_name" =>
            Station::whereColumn("stations.id", "product_transactions.station_id")
                ->select(["name"])
                ->limit(1),
            "product_name" =>
            Product::whereColumn("products.id", "product_transactions.product_id")
                ->select(["name"])
                ->limit(1),
            "unit" =>
            Product::whereColumn("products.id", "product_transactions.product_id")
                ->select(["stock_unit"])
                ->limit(1),
        ]);

        [$sortColumn, $sortDirection] = explode(";", $request->input("order_by", "name;asc"));
        $productTransactionQuery->orderBy($sortColumn, $sortDirection);

        $productTransactions = $productTransactionQuery->paginate($request->input("paginate", 25));

        if ($request->expectsJson()) {
            return response()->json($productTransactions);
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
            "is_correction" => "required|boolean",
            "amount" => "required|numeric",
        ]);

        $productTransaction = ProductTransaction::create($valid);

        if ($request->expectsJson()) {
            return response()->json($productTransaction);
        }

        return to_route("product_transactions.index");
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductTransaction $productTransaction)
    {
        // TODO: product transaction detail inertia view
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductTransaction $productTransaction)
    {
        // TODO: product transaction edit inertia view (probably the same one as for crete())
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProductTransaction $productTransaction)
    {
        $valid = $request->validate([
            "product_id" => "sometimes|required|exists:products,id",
            "station_id" => "sometimes|required|exists:stations,id",
            "is_correction" => "sometimes|required|boolean",
            "amount" => "sometimes|required|numeric",
        ]);

        $productTransaction->fill($valid);
        $productTransaction->save();

        if ($request->expectsJson()) {
            return response()->json($productTransaction);
        }

        return to_route("product_transactions.index");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, ProductTransaction $productTransaction)
    {
        $productTransaction->delete();

        if ($request->expectsJson()) {
            return response()->json($productTransaction);
        }

        return to_route("product_transactions.index");
    }
}
