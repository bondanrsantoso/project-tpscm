<?php

namespace App\Http\Controllers;

use App\Http\Requests\GeneralIndexRequest;
use App\Models\ProductOrderManifest;
use App\Models\Station;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductOrderManifestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(GeneralIndexRequest $request)
    {
        $productOrderManifestQuery = ProductOrderManifest::select(["*"]);

        if ($request->filled("search")) {
            $productOrderManifestQuery->where(function ($q) use ($request) {
                $q->whereRelation("user", "name", "like", "%" . $request->input("search") . "%")
                    ->orWhereRelation("destinationStation", "name", "like", "%" . $request->input("search") . "%")
                    ->orWhere("payment_status", "like", "%" . $request->input("search") . "%");
            });
        }

        $productOrderManifestQuery->addSelect([
            "source_station_name" =>
            Station::whereColumn("stations.id", "product_order_manifests.source_station_id")
                ->select(["name"])
                ->limit(1),
        ]);

        [$sortColumn, $sortDirection] = explode(";", $request->input("order_by", "name;asc"));
        $productOrderManifestQuery->orderBy($sortColumn, $sortDirection);

        $productOrderManifests = $productOrderManifestQuery->paginate($request->input("paginate", 25));

        if ($request->expectsJson()) {
            return response()->json($productOrderManifests);
        }
        // TODO: Add valid intertia view for product order manifest search/list
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
            "order_id" => "required|exists:product_orders,id",
            "source_station_id" => "required|exists:stations,id",
            "shipping_status" => "sometimes|required|in:" . implode(",", ProductOrderManifest::STATUS),
            "shipping_cost" => "required|numeric|min:0",
            "items" => "sometimes|required|array",
            "items.*.product_id" => "sometimes|required|exists:products,id",
            "items.*.qty" => "sometimes|required|numeric|min:1",
        ]);

        try {
            DB::beginTransaction();

            /**
             * @var ProductOrderManifest
             */
            $manifest = ProductOrderManifest::create($valid);

            $manifestItems = collect();
            foreach ($request->input("items", []) as $item) {
                $manifestItem = $manifest->items()->firstOrCreate([
                    "product_id" => $item["product_id"],
                ], $item);
                $manifestItem->fill($item);
                $manifestItem->save();

                $manifestItems->add($manifestItem);
            }

            $manifest->items()
                ->whereNotIn("id", $manifestItems->pluck("id")->all())
                ->delete();

            DB::commit();

            if ($request->expectsJson()) {
                $manifest->refresh();
                $manifest->load(["items", "order", "sourceStation"]);

                return response()->json($manifest);
            }

            return to_route("product_order_manifests.index");
        } catch (\Throwable $th) {
            DB::rollBack();
            if (env("APP_DEBUG", false) && !app()->isProduction()) {
                throw $th;
            }
            abort(500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductOrderManifest $productOrderManifest)
    {
        $productOrderManifest->load([
            "order",
            "sourceStation",
            "items"
        ]);
        // TODO: product order manifest detail inertia view
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductOrderManifest $productOrderManifest)
    {
        $productOrderManifest->load([
            "order",
            "sourceStation",
            "items"
        ]);
        // TODO: product order manifest editor inertia view
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProductOrderManifest $productOrderManifest)
    {
        $valid = $request->validate([
            "order_id" => "sometimes|required|exists:product_orders,id",
            "source_station_id" => "sometimes|required|exists:stations,id",
            "shipping_status" => "sometimes|required|in:" . implode(",", ProductOrderManifest::STATUS),
            "shipping_cost" => "sometimes|required|numeric|min:0",
            "items" => "sometimes|required|array",
            "items.*.product_id" => "sometimes|required|exists:products,id",
            "items.*.qty" => "sometimes|required|numeric|min:1",
        ]);

        try {
            DB::beginTransaction();

            /**
             * @var ProductOrderManifest
             */
            $manifest = ProductOrderManifest::create($valid);

            foreach ($valid["items"] as $item) {
                $manifest->items()->create($item);
            }

            DB::commit();

            if ($request->expectsJson()) {
                $manifest->refresh();
                $manifest->load(["items", "order", "sourceStation"]);

                return response()->json($manifest);
            }

            return to_route("product_order_manifests.index");
        } catch (\Throwable $th) {
            DB::rollBack();
            if (env("APP_DEBUG", false) && !app()->isProduction()) {
                throw $th;
            }
            abort(500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductOrderManifest $productOrderManifest)
    {
        //
    }
}
