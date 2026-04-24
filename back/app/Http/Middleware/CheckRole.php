<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response|JsonResponse
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $allowedRoles = collect($roles)
            ->flatMap(fn (string $roleList) => explode(',', $roleList))
            ->map(fn (string $role) => trim($role))
            ->filter()
            ->values()
            ->all();

        if ($allowedRoles !== [] && ! in_array($user->role, $allowedRoles, true)) {
            return response()->json([
                'message' => 'Forbidden. You do not have access to this resource.',
            ], 403);
        }

        return $next($request);
    }
}