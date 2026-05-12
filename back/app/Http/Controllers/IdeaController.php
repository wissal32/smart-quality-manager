<?php

namespace App\Http\Controllers;

use App\Models\Idea;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class IdeaController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Idea::with('createdBy')->latest()->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', Rule::in(['pending', 'approved', 'rejected'])],
            'votes' => ['nullable', 'integer', 'min:0'],
            'created_by' => ['required', 'exists:users,id'],
        ]);

        $idea = Idea::create($validated)->load('createdBy');

        return response()->json([
            'message' => 'Idée créée avec succès.',
            'data' => $idea,
        ], 201);
    }

    public function show(Idea $idea): JsonResponse
    {
        return response()->json([
            'data' => $idea->load('createdBy'),
        ]);
    }

    public function update(Request $request, Idea $idea): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'status' => ['sometimes', 'required', Rule::in(['pending', 'approved', 'rejected'])],
            'votes' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'created_by' => ['sometimes', 'required', 'exists:users,id'],
        ]);

        $idea->update($validated);

        return response()->json([
            'message' => 'Idée mise à jour avec succès.',
            'data' => $idea->fresh()->load('createdBy'),
        ]);
    }

    public function destroy(Idea $idea): JsonResponse
    {
        $idea->delete();

        return response()->json([
            'message' => 'Idée supprimée avec succès.',
        ]);
    }
}