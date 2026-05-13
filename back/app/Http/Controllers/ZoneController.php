<?php

namespace App\Http\Controllers;

use App\Models\Zone;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ZoneController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Zone::latest()->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:zones,name'],
            'description' => ['nullable', 'string'],
        ]);

        $zone = Zone::create($validated);

        return response()->json([
            'message' => 'Zone créée avec succès.',
            'data' => $zone,
        ], 201);
    }

    public function show(Zone $zone): JsonResponse
    {
        return response()->json([
            'data' => $zone,
        ]);
    }

    public function update(Request $request, Zone $zone): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255', 'unique:zones,name,' . $zone->id],
            'description' => ['sometimes', 'nullable', 'string'],
        ]);

        $zone->update($validated);

        return response()->json([
            'message' => 'Zone mise à jour avec succès.',
            'data' => $zone->fresh(),
        ]);
    }

    public function destroy(Zone $zone): JsonResponse
    {
        $zone->delete();

        return response()->json([
            'message' => 'Zone supprimée avec succès.',
        ]);
    }
}
