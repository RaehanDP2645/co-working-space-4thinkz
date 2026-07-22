<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\OpenClawService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssistantController extends Controller
{
    public function chat(Request $request, OpenClawService $openclaw): JsonResponse
    {
        $validated = $request->validate([
            'message'              => ['required', 'string', 'max:2000'],
            'conversation_history' => ['nullable', 'array', 'max:50'],
            'conversation_history.*.role'    => ['required_with:conversation_history', 'string', 'in:user,assistant'],
            'conversation_history.*.content' => ['required_with:conversation_history', 'string', 'max:2000'],
        ]);

        $history = $validated['conversation_history'] ?? [];

        try {
            $reply = $openclaw->chat($validated['message'], $history);

            return response()->json([
                'reply' => $reply,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'reply' => 'Maaf, Asisten AI sedang tidak tersedia. Silakan coba beberapa saat lagi.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ]);
        }
    }
}
