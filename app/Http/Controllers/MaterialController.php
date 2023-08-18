<?php

namespace App\Http\Controllers;

use App\Models\Material;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaterialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $materialQuery = Material::select(["*"]);

        if ($request->filled("search")) {
            $materialQuery->where(function ($q) use ($request) {
                $q->where("name", "like", "%" . $request->input("search") . "%")
                    ->orWhere("description", "like", "%" . $request->input("search") . "%");
            });
        }

        [$sortColumn, $sortDirection] = explode(";", $request->input("order_by", "name;asc"));
        $materialQuery->orderBy($sortColumn, $sortDirection);

        $materials = $materialQuery->paginate($request->input("paginate", 25));

        return Inertia::render("Materials/Index", [
            "items" => $materials,
            "search" => $request->input("search", ""),
            "order_by" => $request->input("order_by", "name;asc"),
            "page" => $request->input("page", 1),
            "paginate" => $request->input("paginate", 25),
        ]);
        if ($request->expectsJson()) {
            return response()->json($materials);
        }

        // DOING: Add valid intertia view for material search/list
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

        $material = Material::create($valid);

        return to_route("materials.index");
    }

    /**
     * Display the specified resource.
     */
    public function show(Material $material)
    {
        $material->load([
            "stocks" => ["station"],
            "transactions" => ["station"]
        ]);

        return Inertia::render("Materials/Detail", [
            "item" => $material,
            "id" => $material->id
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Material $material)
    {
        // TODO: material edit inertia view
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Material $material)
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

        $material->fill($valid);
        $material->save();

        return to_route("materials.index");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Material $material)
    {
        $material->delete();

        if ($request->expectsJson()) {
            return response()->json(["message" => "OK"]);
        }

        return to_route("materials.index");
    }
}
