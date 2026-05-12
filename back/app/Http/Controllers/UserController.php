<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => User::latest()->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', Rule::in(['admin', 'quality_manager', 'it_referent', 'employee'])],
            'department' => ['nullable', 'string', 'max:255'],
        ])->validate();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'department' => $validated['department'] ?? null,
        ]);

        return response()->json([
            'message' => 'Utilisateur créé avec succès.',
            'data' => $user,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::find($id);

        if (! $user) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        $validated = Validator::make($request->all(), [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['sometimes', 'nullable', 'string', 'min:8'],
            'role' => ['sometimes', 'required', Rule::in(['admin', 'quality_manager', 'it_referent', 'employee'])],
            'department' => ['sometimes', 'nullable', 'string', 'max:255'],
        ])->validate();

        $payload = collect($validated)->only(['name', 'email', 'role', 'department'])->all();

        if (! empty($validated['password'])) {
            $payload['password'] = Hash::make($validated['password']);
        }

        $user->update($payload);

        return response()->json([
            'message' => 'Utilisateur mis à jour avec succès.',
            'data' => $user->fresh(),
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $user = User::find($id);

        if (! $user) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        if ($request->user()?->id === $user->id) {
            return response()->json([
                'message' => 'Vous ne pouvez pas supprimer votre propre compte.',
            ], 422);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'message' => 'Utilisateur supprimé avec succès.',
        ]);
    }
}