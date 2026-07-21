<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    protected function redirectTo(Request $request): ?string
    {
        return null;
    }

    protected function authenticate($request, array $guards)
    {
        if (empty($guards)) {
            $guards = ['sanctum'];
        }

        return parent::authenticate($request, $guards);
    }
}
