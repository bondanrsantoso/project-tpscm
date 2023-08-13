<?php

namespace App\Http\Controllers;

use App\Http\Requests\GeneralIndexRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(GeneralIndexRequest $request)
    {
        $productQuery = Product::select(["*"]);

        if ($request->filled("search")) {
            $productQuery->where(function ($q) use ($request) {
                $q->where("name", "like", "%" . $request->input("search") . "%")
                    ->orWhere("description", "like", "%" . $request->input("search") . "%");
            });
        }

        [$sortColumn, $sortDirection] = explode(";", $request->input("order_by", "name;asc"));
        $productQuery->orderBy($sortColumn, $sortDirection);

        $products = $productQuery->paginate($request->input("paginate", 25));

        // DOING: Add valid intertia view for product search/list
        return Inertia::render("Products/Index", [
            "items" => $products,
            "search" => $request->input("search", ""),
            "order_by" => $request->input("order_by", "name;asc"),
            "page" => $request->input("page", 1),
            "paginate" => $request->input("paginate", 25),
        ]);
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
            "sku" => "required|string",
            "brand" => "required|string",
            "variants" => "required|string",
            "description" => "required|string",
            "image_url" => "required|string",
            "net_weight" => "required|numeric|min:0",
            "gross_weight" => "required|numeric|min:0",
            "tare_weight" => "required|numeric|min:0",
            "width" => "required|numeric|min:0",
            "height" => "required|numeric|min:0",
            "depth" => "required|numeric|min:0",
            "base_value" => "required|numeric|min:0",
            "stock_unit" => "required|string",
        ]);

        $product = Product::create($valid);

        return to_route("products.index");
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product->load([
            "stocks" => ["station"],
            "transactions" => ["station"]
        ]);

        // TODO: product detail inertia view
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        // TODO: product edit inertia view (probably the same one as for crete())
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $valid = $request->validate([
            "sku" => "sometimes|required|string",
            "brand" => "sometimes|required|string",
            "variants" => "sometimes|required|string",
            "description" => "sometimes|required|string",
            "image_url" => "sometimes|required|string",
            "net_weight" => "sometimes|required|numeric|min:0",
            "gross_weight" => "sometimes|required|numeric|min:0",
            "tare_weight" => "sometimes|required|numeric|min:0",
            "width" => "sometimes|required|numeric|min:0",
            "height" => "sometimes|required|numeric|min:0",
            "depth" => "sometimes|required|numeric|min:0",
            "base_value" => "sometimes|required|numeric|min:0",
            "stock_unit" => "sometimes|required|string",
        ]);

        $product = $product->fill($valid);
        $product->save();

        return to_route("products.index");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Product $product)
    {
        $product->delete();

        if ($request->expectsJson()) {
            return response()->json(["message" => "OK"]);
        }

        return to_route("products.index");
    }
}
