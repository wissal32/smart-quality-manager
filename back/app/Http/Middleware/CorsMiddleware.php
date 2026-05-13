<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $allowedOrigins = [
            'localhost:5173',
            'localhost:5174',
            'localhost:3000',
            '127.0.0.1:5173',
            '127.0.0.1:5174',
            '127.0.0.1:3000',
        ];

        $origin = $request->header('origin');

        // Check if origin is allowed
        $isAllowed = false;
        foreach ($allowedOrigins as $allowed) {
            if ($origin === 'http://' . $allowed || $origin === 'https://' . $allowed) {
                $isAllowed = true;
                break;
            }
        }

        if ($isAllowed) {
            // Handle preflight requests
            if ($request->isMethod('options')) {
                return response('', 200)
                    ->header('Access-Control-Allow-Origin', $origin)
                    ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
                    ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
                    ->header('Access-Control-Allow-Credentials', 'true')
                    ->header('Access-Control-Max-Age', '86400');
            }

            $response = $next($request);

            // Add CORS headers to regular responses
            $response->header('Access-Control-Allow-Origin', $origin)
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
                ->header('Access-Control-Allow-Credentials', 'true');

            return $response;
        }

        return $next($request);
    }
}
