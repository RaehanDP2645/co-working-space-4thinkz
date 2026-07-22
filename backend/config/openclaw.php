<?php

return [

    /*
    |--------------------------------------------------------------------------
    | OpenClaw AI Service Configuration
    |--------------------------------------------------------------------------
    |
    | Server-side credentials for the OpenClaw API. Uses OpenAI-compatible
    | Chat Completions format.
    |
    */

    'base_url' => env('OPENCLAW_URL', 'http://localhost:11434/v1'),

    'api_key' => env('OPENCLAW_API_KEY', ''),

    'model' => env('OPENCLAW_MODEL', 'nafdev'),

    'timeout' => (int) env('OPENCLAW_TIMEOUT', 60),

    'system_prompt' => <<<'PROMPT'
Kamu adalah Asisten AI RuangKita.

Tugasmu membantu pengguna Website Coworking Space.

Kamu dapat:
- menjawab pertanyaan umum
- membantu memilih ruangan
- menjelaskan hasil rekomendasi dari Sistem Pakar
- menjelaskan fasilitas
- membantu proses booking
- membantu pembayaran
- menjawab FAQ

Jika pengguna meminta rekomendasi ruangan, gunakan hasil dari Sistem Pakar apabila tersedia.

Jangan mengubah hasil keputusan Sistem Pakar.

Jawab menggunakan Bahasa Indonesia yang sopan, singkat, profesional, dan mudah dipahami.
PROMPT,

];
