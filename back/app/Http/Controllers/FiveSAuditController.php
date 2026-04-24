<?php

namespace App\Http\Controllers;

use App\Models\FiveSAudit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FiveSAuditController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => FiveSAudit::with(['zone', 'createdBy'])->latest()->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'zone_id' => ['required', 'exists:zones,id'],
            'tri' => ['required', 'boolean'],
            'ranger' => ['required', 'boolean'],
            'nettoyer' => ['required', 'boolean'],
            'standardiser' => ['required', 'boolean'],
            'maintenir' => ['required', 'boolean'],
            'score' => ['required', 'numeric', 'min:0'],
            'photos_before' => ['nullable', 'array'],
            'photos_before.*' => ['nullable', 'string'],
            'photos_after' => ['nullable', 'array'],
            'photos_after.*' => ['nullable', 'string'],
            'created_by' => ['required', 'exists:users,id'],
        ]);

        $audit = FiveSAudit::create($validated)->load(['zone', 'createdBy']);

        return response()->json([
            'message' => '5S audit created successfully.',
            'data' => $audit,
        ], 201);
    }

    public function show(FiveSAudit $five_s_audit): JsonResponse
    {
        return response()->json([
            'data' => $five_s_audit->load(['zone', 'createdBy']),
        ]);
    }

    public function update(Request $request, FiveSAudit $five_s_audit): JsonResponse
    {
        $validated = $request->validate([
            'zone_id' => ['sometimes', 'required', 'exists:zones,id'],
            'tri' => ['sometimes', 'required', 'boolean'],
            'ranger' => ['sometimes', 'required', 'boolean'],
            'nettoyer' => ['sometimes', 'required', 'boolean'],
            'standardiser' => ['sometimes', 'required', 'boolean'],
            'maintenir' => ['sometimes', 'required', 'boolean'],
            'score' => ['sometimes', 'required', 'numeric', 'min:0'],
            'photos_before' => ['sometimes', 'nullable', 'array'],
            'photos_before.*' => ['nullable', 'string'],
            'photos_after' => ['sometimes', 'nullable', 'array'],
            'photos_after.*' => ['nullable', 'string'],
            'created_by' => ['sometimes', 'required', 'exists:users,id'],
        ]);

        $five_s_audit->update($validated);

        return response()->json([
            'message' => '5S audit updated successfully.',
            'data' => $five_s_audit->fresh()->load(['zone', 'createdBy']),
        ]);
    }

    public function destroy(FiveSAudit $five_s_audit): JsonResponse
    {
        $five_s_audit->delete();

        return response()->json([
            'message' => '5S audit deleted successfully.',
        ]);
    }
}