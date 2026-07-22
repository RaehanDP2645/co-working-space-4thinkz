<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenClawService
{
    protected string $baseUrl;
    protected string $apiKey;
    protected string $model;
    protected int $timeout;

    public function __construct()
    {
        $this->baseUrl = rtrim(config('openclaw.base_url'), '/');
        $this->apiKey = config('openclaw.api_key', '');
        $this->model = config('openclaw.model', 'nafdev');
        $this->timeout = config('openclaw.timeout', 60);
    }

    public function chat(string $message, array $conversationHistory = []): string
    {
        $messages = [];

        $systemPrompt = config('openclaw.system_prompt', '');
        if ($systemPrompt) {
            $messages[] = [
                'role' => 'system',
                'content' => $systemPrompt,
            ];
        }

        foreach ($conversationHistory as $msg) {
            $messages[] = [
                'role' => $msg['role'] ?? ($msg['from'] === 'user' ? 'user' : 'assistant'),
                'content' => $msg['content'] ?? $msg['text'] ?? '',
            ];
        }

        $messages[] = [
            'role' => 'user',
            'content' => $message,
        ];

        $headers = [
            'Content-Type' => 'application/json',
        ];

        if ($this->apiKey) {
            $headers['Authorization'] = 'Bearer ' . $this->apiKey;
        }

        $response = Http::withHeaders($headers)
            ->timeout($this->timeout)
            ->post("{$this->baseUrl}/chat/completions", [
                'model' => $this->model,
                'messages' => $messages,
                'temperature' => 0.7,
                'max_tokens' => 1024,
            ]);

        if ($response->failed()) {
            Log::error('OpenClaw API error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            throw new \RuntimeException(
                'OpenClaw tidak dapat diakses: ' . ($response->body() ?: $response->status())
            );
        }

        $body = $response->body();
        $body = preg_replace('/\s*data: \[DONE\]\s*$/', '', $body);
        $data = json_decode(trim($body), true);

        if (!is_array($data) || !isset($data['choices'][0]['message']['content'])) {
            Log::error('OpenClaw unexpected response', ['body' => substr($body, 0, 500)]);
            return 'Maaf, terjadi kesalahan saat memproses permintaan Anda.';
        }

        return $data['choices'][0]['message']['content'];
    }
}
