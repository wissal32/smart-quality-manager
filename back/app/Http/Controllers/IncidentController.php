<?php

namespace App\Http\Controllers;

use App\Models\Incident;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class IncidentController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Incident::with(['reportedBy', 'assignedTo'])->latest()->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category' => ['required', 'string', 'max:255'],
            'severity' => ['required', Rule::in(['low', 'medium', 'high', 'critical'])],
            'cause' => ['nullable', 'string'],
            'corrective_action' => ['nullable', 'string'],
            'status' => ['required', Rule::in(['open', 'investigating', 'resolved'])],
            'reported_by' => ['required', 'exists:users,id'],
            'assigned_to' => ['nullable', 'exists:users,id'],
        ]);

        $incident = Incident::create($validated)->load(['reportedBy', 'assignedTo']);

        return response()->json([
            'message' => 'Incident créé avec succès.',
            'data' => $incident,
        ], 201);
    }

    public function show(Incident $incident): JsonResponse
    {
        return response()->json([
            'data' => $incident->load(['reportedBy', 'assignedTo']),
        ]);
    }

    public function update(Request $request, Incident $incident): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'category' => ['sometimes', 'required', 'string', 'max:255'],
            'severity' => ['sometimes', 'required', Rule::in(['low', 'medium', 'high', 'critical'])],
            'cause' => ['sometimes', 'nullable', 'string'],
            'corrective_action' => ['sometimes', 'nullable', 'string'],
            'status' => ['sometimes', 'required', Rule::in(['open', 'investigating', 'resolved'])],
            'reported_by' => ['sometimes', 'required', 'exists:users,id'],
            'assigned_to' => ['sometimes', 'nullable', 'exists:users,id'],
        ]);

        $incident->update($validated);

        return response()->json([
            'message' => 'Incident mis à jour avec succès.',
            'data' => $incident->fresh()->load(['reportedBy', 'assignedTo']),
        ]);
    }

    public function destroy(Incident $incident): JsonResponse
    {
        $incident->delete();

        return response()->json([
            'message' => 'Incident supprimé avec succès.',
        ]);
    }
}