<?php

namespace App\Http\Controllers;

use App\Models\Action;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ActionController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Action::with(['assignedTo', 'createdBy'])->latest()->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'priority' => ['required', Rule::in(['low', 'medium', 'high'])],
            'status' => ['required', Rule::in(['todo', 'in_progress', 'done'])],
            'deadline' => ['nullable', 'date'],
            'assigned_to' => ['required', 'exists:users,id'],
            'created_by' => ['required', 'exists:users,id'],
        ]);

        $action = Action::create($validated)->load(['assignedTo', 'createdBy']);

        return response()->json([
            'message' => 'Action created successfully.',
            'data' => $action,
        ], 201);
    }

    public function show(Action $action): JsonResponse
    {
        return response()->json([
            'data' => $action->load(['assignedTo', 'createdBy']),
        ]);
    }

    public function update(Request $request, Action $action): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'priority' => ['sometimes', 'required', Rule::in(['low', 'medium', 'high'])],
            'status' => ['sometimes', 'required', Rule::in(['todo', 'in_progress', 'done'])],
            'deadline' => ['sometimes', 'nullable', 'date'],
            'assigned_to' => ['sometimes', 'required', 'exists:users,id'],
            'created_by' => ['sometimes', 'required', 'exists:users,id'],
        ]);

        $action->update($validated);

        return response()->json([
            'message' => 'Action updated successfully.',
            'data' => $action->fresh()->load(['assignedTo', 'createdBy']),
        ]);
    }

    public function destroy(Action $action): JsonResponse
    {
        $action->delete();

        return response()->json([
            'message' => 'Action deleted successfully.',
        ]);
    }
}