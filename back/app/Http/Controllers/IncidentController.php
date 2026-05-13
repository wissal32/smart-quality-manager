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
            'location' => ['nullable', 'string', 'max:255'],
            'severity' => ['required', Rule::in(['low', 'medium', 'high', 'critical'])],
            'cause' => ['nullable', 'string'],
            'corrective_action' => ['nullable', 'string'],
            'status' => ['required', Rule::in(['open', 'investigating', 'resolved'])],
            'reported_by' => ['required', 'exists:users,id'],
            'assigned_to' => ['nullable', 'exists:users,id'],
            'photos' => ['nullable', 'array'],
            'photos.*' => ['nullable', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        // Handle file uploads - encode to base64
        $photoData = [];
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $file) {
                $fileContent = file_get_contents($file->getRealPath());
                $base64 = base64_encode($fileContent);
                $mimeType = $file->getMimeType();
                $photoData[] = [
                    'data' => $base64,
                    'mime' => $mimeType,
                    'name' => $file->getClientOriginalName(),
                ];
            }
        }

        if ($photoData) {
            $validated['photos'] = json_encode($photoData);
        }

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
            'location' => ['sometimes', 'nullable', 'string', 'max:255'],
            'severity' => ['sometimes', 'required', Rule::in(['low', 'medium', 'high', 'critical'])],
            'cause' => ['sometimes', 'nullable', 'string'],
            'corrective_action' => ['sometimes', 'nullable', 'string'],
            'status' => ['sometimes', 'required', Rule::in(['open', 'investigating', 'resolved'])],
            'reported_by' => ['sometimes', 'required', 'exists:users,id'],
            'assigned_to' => ['sometimes', 'nullable', 'exists:users,id'],
            'photos' => ['sometimes', 'nullable', 'array'],
            'photos.*' => ['nullable', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        // Handle new file uploads - encode to base64
        if ($request->hasFile('photos')) {
            $photoData = [];
            if ($incident->photos) {
                $photoData = json_decode($incident->photos, true) ?? [];
            }
            foreach ($request->file('photos') as $file) {
                $fileContent = file_get_contents($file->getRealPath());
                $base64 = base64_encode($fileContent);
                $mimeType = $file->getMimeType();
                $photoData[] = [
                    'data' => $base64,
                    'mime' => $mimeType,
                    'name' => $file->getClientOriginalName(),
                ];
            }
            $validated['photos'] = json_encode($photoData);
        }

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