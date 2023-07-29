<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $valid = $request->validate([
            "search" => "sometimes|nullable|string",
            "order_by" => "sometimes|nullable|string",
            "paginate" => "sometimes|nullable|integer|min:1",
        ]);


        $itemsQuery = Item::select(["*"]);

        if ($request->filled("search")) {
            $itemsQuery->where(function ($q) use ($request) {
                $q->where("name", "like", "%" . $request->input("search") . "%")
                    ->orWhere("description", "like", "%" . $request->input("search") . "%");
            });
        }

        [$sortColumn, $sortDirection] = explode(";", $request->input("order_by", "name;asc"));
        $itemsQuery->orderBy($sortColumn, $sortDirection);

        $items = $itemsQuery->paginate($request->input("paginate", 25));

        return Inertia::render("Items/Index", [
            "items" => $items,
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
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Item $item)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Item $item)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Item $item)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Item $item)
    {
        //
    }
}
