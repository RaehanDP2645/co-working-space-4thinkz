<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    /**
     * redirect user ke halaman consent google
     */
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')
        ->stateless()
        ->redirect();
    }

    /**
     * terima callback google
     */
    public function callback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')
            ->stateless()
            ->user();
        } catch (\Throwable $e) {
            return redirect(config('app.frontend_url').'/login?error=google_auth_failed');
        }

        // cari pengguna berdasarkan google id, lalu ke email
        $user = User::where('google_id', $googleUser->getId())
            ->orWhere('email', $googleUser->getEmail())
            ->first();

        if ($user) {
            if (! $user->google_id) {
                $user->update(['google_id' => $googleUser->getId()]);
            }
        } else {
            $user = User::create([
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'google_id' => $googleUser->getId(),
                'password' => Hash::make(Str::random(24)),
                'email_verified_at' => now(), // email Google terverifikasi
                'peran' => User::ROLE_USER,
            ]);
        }

        $exchangeCode = Str::random(40);
        Cache::put("google_auth_code:{$exchangeCode}", $user->id, now()->addSeconds(60));

        return redirect(config('app.frontend_url')."/auth/callback?code={$exchangeCode}");
    }

    public function exchange(Request $request): JsonResponse
    {
        $request->validate(['code' => 'required|string']);

        $userId = Cache::pull("google_auth_code:{$request->code}");

        if (! $userId) {
            return response()->json([
                'message' => 'Kode tidak valid atau sudah kedaluwarsa.',
            ], 401);
        }

        $user = User::findOrFail($userId);
        $token = $user->createToken('google-auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }
}
