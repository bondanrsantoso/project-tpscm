<?php

namespace App\Http\Controllers;

use App\Models\Station;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $stationQuery = Station::select(["*"]);

        if ($request->filled("search")) {
            $stationQuery->where(function ($q) use ($request) {
                $q->where("name", "like", "%" . $request->input("search") . "%")
                    ->orWhere("description", "like", "%" . $request->input("search") . "%")
                    ->orWhere("address", "like", "%" . $request->input("search") . "%");
            });
        }

        [$sortColumn, $sortDirection] = explode(";", $request->input("order_by", "name;asc"));
        $stationQuery->orderBy($sortColumn, $sortDirection);

        $stations = $stationQuery->paginate($request->input("paginate", 25));

        if ($request->expectsJson()) {
            return response()->json($stations);
        }

        // DONE: Add valid intertia view for product search/list
        return Inertia::render("Stations/Index", [
            "items" => $stations,
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
        // DONE make inertia form view for creating and/or updating station data
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $stationTypes = implode(",", Station::TYPE);

        $valid = $request->validate([
            "name" => "required|string",
            "description" => "required|string",
            "address" => "nullable|string",
            "type" => "required|in:{$stationTypes}",
            "lat" => "required|numeric",
            "lng" => "required|numeric",
        ]);

        $station = Station::create($valid);

        return to_route("stations.index");
    }

    /**
     * Display the specified resource.
     */
    public function show(Station $station)
    {
        $station->load([
            "products",
            "productTransactions" => ["product"],
            "materials",
            "materialTransactions" => ["material"],
        ]);

        // TODO make inertia form view for showing station detail
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Station $station)
    {
        $station->load([
            "products",
            "productTransactions" => ["product"],
            "materials",
            "materialTransactions" => ["material"],
        ]);
        // DONE make inertia form view for creating and/or updating station data
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Station $station)
    {
        $stationTypes = implode(",", Station::TYPE);

        $valid = $request->validate([
            "name" => "sometimes|required|string",
            "description" => "sometimes|required|string",
            "address" => "sometimes|nullable|string",
            "type" => "sometimes|required|in:{$stationTypes}",
            "lat" => "sometimes|required|numeric",
            "lng" => "sometimes|required|numeric",
        ]);

        $station->fill($valid);
        $station->save();

        return to_route("stations.index");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Station $station)
    {
        $station->delete();

        if ($request->expectsJson()) {
            return response()->json(["message" => "OK"]);
        }

        return to_route("stations.index");
    }
}
