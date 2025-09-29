<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateSanctum
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return response()->json([
                'error' => 'Unauthorized. Token is invalid or expired.'
            ], Response::HTTP_UNAUTHORIZED);
        }

        return $next($request);
    }
}