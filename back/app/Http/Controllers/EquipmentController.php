<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EquipmentController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Equipment::latest()->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'max:255'],
            'serial_number' => ['required', 'string', 'max:255', 'unique:equipments,serial_number'],
            'status' => ['required', Rule::in(['working', 'broken', 'maintenance'])],
            'qr_code' => ['nullable', 'string', 'max:255'],
            'last_maintenance' => ['nullable', 'date'],
        ]);

        $equipment = Equipment::create($validated);

        return response()->json([
            'message' => 'Equipment created successfully.',
            'data' => $equipment,
        ], 201);
    }

    public function show(Equipment $equipment): JsonResponse
    {
        return response()->json([
            'data' => $equipment,
        ]);
    }

    public function update(Request $request, Equipment $equipment): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'type' => ['sometimes', 'required', 'string', 'max:255'],
            'serial_number' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('equipments', 'serial_number')->ignore($equipment->id)],
            'status' => ['sometimes', 'required', Rule::in(['working', 'broken', 'maintenance'])],
            'qr_code' => ['sometimes', 'nullable', 'string', 'max:255'],
            'last_maintenance' => ['sometimes', 'nullable', 'date'],
        ]);

        $equipment->update($validated);

        return response()->json([
            'message' => 'Equipment updated successfully.',
            'data' => $equipment->fresh(),
        ]);
    }

    public function destroy(Equipment $equipment): JsonResponse
    {
        $equipment->delete();

        return response()->json([
            'message' => 'Equipment deleted successfully.',
        ]);
    }
}