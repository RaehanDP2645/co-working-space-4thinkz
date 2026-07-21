<?php

return [

    /*
    |--------------------------------------------------------------------------
    | PayWuzz Payment Gateway Configuration
    |--------------------------------------------------------------------------
    |
    | Server-side credentials for the PayWuzz API. Keep the secret key on the
    | backend only; the frontend must never call PayWuzz directly.
    |
    */

    'base_url' => env('PAYWUZ_BASE_URL', 'https://api.paywuz.id/v1'),

    'api_key' => env('PAYWUZ_API_KEY', 'pk_sand_9be561b3c78a3bf951d55daefade26ea'),

    'callback_url' => env('PAYWUZ_CALLBACK_URL', 'http://localhost:8000/api/payments/callback'),

];
