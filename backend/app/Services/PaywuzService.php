<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class PaywuzService
{
    protected string $baseUrl;
    protected string $apiKey;

    public function __construct()
    {
        $this->baseUrl = config('paywuz.base_url');
        $this->apiKey = config('paywuz.api_key');
    }

    protected function request(string $method, string $endpoint, array $body = [])
    {
        $response = Http::withToken($this->apiKey)
            ->acceptJson()
            ->withHeaders(['Content-Type' => 'application/json'])
            ->$method("{$this->baseUrl}{$endpoint}", $body);

        if ($response->failed()) {
            throw new \Exception($response->json('message') ?? "PayWuzz API error: {$response->status()}");
        }

        return $response->json();
    }

    public function createTransaction(array $payload)
    {
        return $this->request('post', '/transactions', $payload);
    }

    public function getTransaction(string $orderId)
    {
        return $this->request('get', "/transactions/{$orderId}");
    }

    public function cancelTransaction(string $orderId)
    {
        return $this->request('post', "/transactions/{$orderId}/cancel");
    }

    public function simulatePayment(string $orderId)
    {
        return $this->request('post', "/transactions/{$orderId}/simulate");
    }

    public function getPaymentMethods()
    {
        return $this->request('get', '/payment-methods');
    }
}
