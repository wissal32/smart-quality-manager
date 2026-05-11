<?php

namespace App\Http\Controllers;

use App\Models\FiveSAudit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
            'tri' => ['required', 'integer', 'min:1', 'max:5'],
            'ranger' => ['required', 'integer', 'min:1', 'max:5'],
            'nettoyer' => ['required', 'integer', 'min:1', 'max:5'],
            'standardiser' => ['required', 'integer', 'min:1', 'max:5'],
            'maintenir' => ['required', 'integer', 'min:1', 'max:5'],
            'score' => ['required', 'numeric', 'min:0'],
            'photos_before' => ['nullable', 'array'],
            'photos_before.*' => ['nullable', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'photos_after' => ['nullable', 'array'],
            'photos_after.*' => ['nullable', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'created_by' => ['required', 'exists:users,id'],
        ]);

        // Handle file uploads
        $beforePaths = [];
        if ($request->hasFile('photos_before')) {
            foreach ($request->file('photos_before') as $file) {
                $path = $file->store('audits/before', 'public');
                $beforePaths[] = Storage::url($path);
            }
        }

        $afterPaths = [];
        if ($request->hasFile('photos_after')) {
            foreach ($request->file('photos_after') as $file) {
                $path = $file->store('audits/after', 'public');
                $afterPaths[] = Storage::url($path);
            }
        }

        // Create audit with file paths
        $validated['photos_before'] = $beforePaths ? json_encode($beforePaths) : null;
        $validated['photos_after'] = $afterPaths ? json_encode($afterPaths) : null;

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
            'tri' => ['sometimes', 'required', 'integer', 'min:1', 'max:5'],
            'ranger' => ['sometimes', 'required', 'integer', 'min:1', 'max:5'],
            'nettoyer' => ['sometimes', 'required', 'integer', 'min:1', 'max:5'],
            'standardiser' => ['sometimes', 'required', 'integer', 'min:1', 'max:5'],
            'maintenir' => ['sometimes', 'required', 'integer', 'min:1', 'max:5'],
            'score' => ['sometimes', 'required', 'numeric', 'min:0'],
            'photos_before' => ['sometimes', 'nullable', 'array'],
            'photos_before.*' => ['nullable', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'photos_after' => ['sometimes', 'nullable', 'array'],
            'photos_after.*' => ['nullable', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'created_by' => ['sometimes', 'required', 'exists:users,id'],
        ]);

        // Handle file uploads for before photos
        if ($request->hasFile('photos_before')) {
            $beforePaths = [];
            foreach ($request->file('photos_before') as $file) {
                $path = $file->store('audits/before', 'public');
                $beforePaths[] = Storage::url($path);
            }
            $validated['photos_before'] = json_encode($beforePaths);
        }

        // Handle file uploads for after photos
        if ($request->hasFile('photos_after')) {
            $afterPaths = [];
            foreach ($request->file('photos_after') as $file) {
                $path = $file->store('audits/after', 'public');
                $afterPaths[] = Storage::url($path);
            }
            $validated['photos_after'] = json_encode($afterPaths);
        }

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