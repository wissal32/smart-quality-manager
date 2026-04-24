<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Throwable;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['nullable', Rule::in(['admin', 'quality_manager', 'it_referent', 'innovation_referent', 'employee'])],
            'department' => ['nullable', 'string', 'max:255'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'] ?? 'employee',
            'department' => $validated['department'] ?? null,
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully.',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $request->headers->set('Accept', 'application/json');

        try {
            $validator = Validator::make($request->all(), [
                'email' => ['required', 'email'],
                'password' => ['required', 'string'],
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'The given data was invalid.',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $credentials = $validator->validated();

            $user = User::where('email', $credentials['email'])->first();

            if (! $user) {
                return response()->json([
                    'message' => 'User not found.',
                ], 404);
            }

            if (! is_string($user->password) || $user->password === '') {
                return response()->json([
                    'message' => 'Stored password is invalid.',
                ], 500);
            }

            $passwordMatches = false;

            if (Hash::isHashed($user->password)) {
                try {
                    $passwordMatches = Hash::check($credentials['password'], $user->password);
                } catch (Throwable $throwable) {
                    report($throwable);

                    return response()->json([
                        'message' => 'Unable to verify the stored password hash.',
                    ], 500);
                }
            } elseif (hash_equals($user->password, $credentials['password'])) {
                $user->forceFill([
                    'password' => Hash::make($credentials['password']),
                ])->save();

                $passwordMatches = true;
            }

            if (! $passwordMatches) {
                return response()->json([
                    'message' => 'Invalid password.',
                ], 401);
            }

            $user->tokens()->delete();

            return response()->json([
                'user' => $user,
                'token' => $user->createToken('api-token')->plainTextToken,
            ], 200);
        } catch (Throwable $throwable) {
            report($throwable);

            return response()->json([
                'message' => 'Login failed due to an internal error.',
            ], 500);
        }
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }
}