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
            'data' => FiveSAudit::select([
                'id',
                'zone_id',
                'tri',
                'ranger',
                'nettoyer',
                'standardiser',
                'maintenir',
                'score',
                'created_by',
                'created_at',
                'updated_at',
            ])->with(['zone', 'createdBy'])->latest()->get(),
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

        // Handle file uploads - encode to base64
        $beforePhotoData = [];
        if ($request->hasFile('photos_before')) {
            foreach ($request->file('photos_before') as $file) {
                $fileContent = file_get_contents($file->getRealPath());
                $base64 = base64_encode($fileContent);
                $mimeType = $file->getMimeType();
                $beforePhotoData[] = [
                    'data' => $base64,
                    'mime' => $mimeType,
                    'name' => $file->getClientOriginalName(),
                ];
            }
        }

        $afterPhotoData = [];
        if ($request->hasFile('photos_after')) {
            foreach ($request->file('photos_after') as $file) {
                $fileContent = file_get_contents($file->getRealPath());
                $base64 = base64_encode($fileContent);
                $mimeType = $file->getMimeType();
                $afterPhotoData[] = [
                    'data' => $base64,
                    'mime' => $mimeType,
                    'name' => $file->getClientOriginalName(),
                ];
            }
        }

        // Create audit with base64 encoded photos
        $validated['photos_before'] = $beforePhotoData ? json_encode($beforePhotoData) : null;
        $validated['photos_after'] = $afterPhotoData ? json_encode($afterPhotoData) : null;

        $audit = FiveSAudit::create($validated)->load(['zone', 'createdBy']);

        return response()->json([
            'message' => 'Audit 5S créé avec succès.',
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

        // Handle file uploads for before photos - encode to base64
        if ($request->hasFile('photos_before')) {
            $beforePhotoData = [];
            foreach ($request->file('photos_before') as $file) {
                $fileContent = file_get_contents($file->getRealPath());
                $base64 = base64_encode($fileContent);
                $mimeType = $file->getMimeType();
                $beforePhotoData[] = [
                    'data' => $base64,
                    'mime' => $mimeType,
                    'name' => $file->getClientOriginalName(),
                ];
            }
            $validated['photos_before'] = json_encode($beforePhotoData);
        }

        // Handle file uploads for after photos - encode to base64
        if ($request->hasFile('photos_after')) {
            $afterPhotoData = [];
            foreach ($request->file('photos_after') as $file) {
                $fileContent = file_get_contents($file->getRealPath());
                $base64 = base64_encode($fileContent);
                $mimeType = $file->getMimeType();
                $afterPhotoData[] = [
                    'data' => $base64,
                    'mime' => $mimeType,
                    'name' => $file->getClientOriginalName(),
                ];
            }
            $validated['photos_after'] = json_encode($afterPhotoData);
        }

        $five_s_audit->update($validated);

        return response()->json([
            'message' => 'Audit 5S mis à jour avec succès.',
            'data' => $five_s_audit->fresh()->load(['zone', 'createdBy']),
        ]);
    }

    public function destroy(FiveSAudit $five_s_audit): JsonResponse
    {
        $five_s_audit->delete();

        return response()->json([
            'message' => 'Audit 5S supprimé avec succès.',
        ]);
    }
}