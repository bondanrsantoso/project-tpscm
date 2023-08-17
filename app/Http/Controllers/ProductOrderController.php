<?php

namespace App\Http\Controllers;

use App\Http\Requests\GeneralIndexRequest;
use App\Models\Product;
use App\Models\ProductOrder;
use App\Models\ProductOrderItem;
use App\Models\Station;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(GeneralIndexRequest $request)
    {
        $productOrderQuery = ProductOrder::select(["*"]);

        if ($request->filled("search")) {
            $productOrderQuery->where(function ($q) use ($request) {
                $q->whereRelation("user", "name", "like", "%" . $request->input("search") . "%")
                    ->orWhereRelation("destinationStation", "name", "like", "%" . $request->input("search") . "%")
                    ->orWhere("payment_status", "like", "%" . $request->input("search") . "%");
            });
        }

        $productOrderQuery->addSelect([
            "user_name" =>
            User::whereColumn("users.id", "product_orders.user_id")
                ->select(["name"])
                ->limit(1),
            "destination_station_name" =>
            Station::whereColumn("stations.id", "product_orders.destination_station_id")
                ->select(["name"])
                ->limit(1),
            "billed_amount" =>
            ProductOrderItem::whereColumn("product_order_items.order_id", "product_orders.id")
                ->selectRaw("sum(product_order_items.billed_subtotal)")
                ->limit(1),
        ]);

        [$sortColumn, $sortDirection] = explode(";", $request->input("order_by", "name;asc"));
        $productOrderQuery->orderBy($sortColumn, $sortDirection);

        $productOrders = $productOrderQuery->paginate($request->input("paginate", 25));

        if ($request->expectsJson()) {
            return response()->json($productOrders);
        }

        // TODO: Add valid intertia view for product order search/list
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
        if ($request->user()) {
            $request->merge([
                "user_id" => $request->user()->id
            ]);
        }

        $valid = $request->validate([
            "user_id" => "required|exists:users,id",
            "destination_station_id" => "required|exists:stations,id",
            "payment_status" => "sometimes|required|in:" . implode(",", ProductOrder::PAYMENT_STATUS),
            "items" => "sometimes|required|array",
            "items.*.product_id" => "sometimes|required|exists:products,id",
            "items.*.requested_qty" => "sometimes|required|numeric|min:1",
            "items.*.billed_subtotal" => "sometimes|required|numeric|min:0",
        ]);

        try {
            DB::beginTransaction();


            $items = collect($request->input("items", []));
            $productIds = $items->pluck("product_id");

            /**
             * @var ProductOrder
             */
            $order = ProductOrder::create($valid);
            $products = Product::whereIn("id", $productIds->all())
                ->select(["id", "base_value"])
                ->get()
                ->keyBy("id");

            $items = $items->map(function ($item, $key) use ($products) {
                $item["base_subtotal"] =
                    $item["requested_qty"] * $products->get($item['product_id'])->base_value;

                return $item;
            });

            foreach ($items as $item) {
                $order->items()->create($item);
            }

            DB::commit();
            if ($request->expectsJson()) {
                $order->refresh();
                $order->load(["items", "user", "destinationStation"]);

                return response()->json($order);
            }

            return to_route("product_orders.index");
        } catch (\Throwable $th) {
            DB::rollBack();
            if (env("APP_DEBUG", false)) {
                throw $th;
            }
            abort(500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductOrder $productOrder)
    {
        $productOrder->load([
            "user",
            "destinationStation",
            "items",
        ]);
        // TODO: product order detail inertia view
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductOrder $productOrder)
    {
        $productOrder->load([
            "user",
            "destinationStation",
            "items",
        ]);
        // TODO: product order editor inertia view
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProductOrder $productOrder)
    {
        if ($request->user()) {
            $request->merge([
                "user_id" => $request->user()->id
            ]);
        }

        $valid = $request->validate([
            "user_id" => "required|exists:users,id",
            "destination_station_id" => "required|exists:stations,id",
            "payment_status" => "sometimes|required|in:" . implode(",", ProductOrder::PAYMENT_STATUS),
            "items" => "sometimes|required|array",
            "items.*.product_id" => "sometimes|required|exists:products,id",
            "items.*.requested_qty" => "sometimes|required|numeric|min:1",
            "items.*.received_qty" => "sometimes|required|numeric|min:0",
            "items.*.billed_subtotal" => "sometimes|required|numeric|min:0",
        ]);

        try {
            DB::beginTransaction();

            $items = collect($valid["items"]);
            $productIds = $items->pluck("product_id");

            /**
             * @var ProductOrder
             */
            $order = $productOrder;
            $order->fill($valid);
            $order->save();

            $products = Product::whereIn("id", $productIds->all())
                ->select(["id", "base_value"])
                ->get()
                ->keyBy("id");

            $items = $items->map(function ($item, $key) use ($products) {
                $item["base_subtotal"] =
                    $item["requested_qty"] * $products->get($item['product_id'])->base_value;

                return $item;
            });

            $existingItems = collect();
            foreach ($items as $item) {
                $existingItem = $order->items()->firstOrCreate([
                    "product_id" => $item["product_id"]
                ], $item);

                $existingItem->fill($item);
                $existingItem->save();

                $existingItems->add($existingItem);
            }

            $order->items()
                ->whereNotIn("id", $existingItems->pluck("id")->all())
                ->delete();

            DB::commit();
            if ($request->expectsJson()) {
                $order->refresh();
                $order->load(["items", "user", "destinationStation"]);

                return response()->json($order);
            }

            return to_route("product_orders.index");
        } catch (\Throwable $th) {
            DB::rollBack();
            if (env("APP_DEBUG", false)) {
                throw $th;
            }
            abort(500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, ProductOrder $productOrder)
    {
        $productOrder->delete();
        if ($request->expectsJson()) {

            return response()->json(["messages" => "OK"]);
        }

        return to_route("product_orders.index");
    }
}
