<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // ganti password user
    // upload foto profil (file atau url template)
    public function uploadAvatar(Request $request): JsonResponse
    {
        $user = $request->user();

        // Upload file langsung (multipart)
        if ($request->hasFile('avatar_file')) {
            $file = $request->file('avatar_file');
            $ext = $file->getClientOriginalExtension();
            $filename = 'avatars/user-' . $user->id . '-' . time() . '.' . $ext;
            $file->storeAs('public/avatars', $filename);
            $user->update(['avatar' => 'avatars/' . $filename]);
            return response()->json([
                'message' => 'Foto profil berhasil diperbarui.',
                'avatar_url' => $user->avatar_url,
            ]);
        }

        $validated = $request->validate([
            'avatar' => ['required', 'string', 'max:5000000'],
        ]);

        $value = $validated['avatar'];
        // jika base64 data uri, simpan ke storage sebagai file
        if (preg_match('/^data:image\/(\w+);base64,/', $value, $m)) {
            $ext = $m[1];
            $data = base64_decode(substr($value, strpos($value, ',') + 1));
            $filename = 'avatars/user-' . $user->id . '-' . time() . '.' . $ext;
            \Illuminate\Support\Facades\Storage::disk('public')->put($filename, $data);
            $value = $filename;
        }
        // jika url template (http/https) simpan langsung
        $user->update(['avatar' => $value]);
        return response()->json([
            'message' => 'Foto profil berhasil diperbarui.',
            'avatar_url' => $user->avatar_url,
        ]);
    }

    // update profil user (nama, email, no telepon)
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:100', 'unique:users,email,' . $user->id],
            'no_telepon' => ['required', 'string', 'max:20'],
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'no_telepon' => $validated['no_telepon'],
        ]);

        return response()->json([
            'message' => 'Profil berhasil diperbarui.',
            'user' => $user,
            'avatar_url' => $user->avatar_url,
        ]);
    }

    public function updatePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        $user = $request->user();

        if (! Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Password lama tidak sesuai.',
            ], 422);
        }

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'message' => 'Password berhasil diubah.',
        ]);
    }
}
