<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Pemesanan;
use App\Services\PaywuzService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PaywuzController extends Controller
{
    protected PaywuzService $paywuz;

    public function __construct(PaywuzService $paywuz)
    {
        $this->paywuz = $paywuz;
    }

    public function paymentMethods(): JsonResponse
    {
        $methods = $this->paywuz->getPaymentMethods();

        return response()->json([
            'message' => 'Metode pembayaran berhasil diambil.',
            'data' => $methods,
        ]);
    }

    public function createTransaction(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'orderId' => ['required', 'string'],
            'amount' => ['required', 'numeric', 'min:1'],
            'paymentMethod' => ['required', 'string'],
            'redirectUrl' => ['nullable', 'url'],
            'metadata' => ['nullable', 'array'],
        ]);

        $bookingCode = $validated['metadata']['reservationCode'] ?? null;
        $pemesanan = $bookingCode
            ? Pemesanan::where('kode_pemesanan', $bookingCode)->first()
            : null;

        $payload = [
            'orderId' => $validated['orderId'],
            'amount' => (int) $validated['amount'],
            'paymentMethod' => $validated['paymentMethod'],
            'redirectUrl' => $validated['redirectUrl'] ?? config('paywuz.callback_url'),
            'metadata' => $validated['metadata'] ?? [],
        ];

        $result = $this->paywuz->createTransaction($payload);
        $trx = $result['data'] ?? $result;

        $payment = null;
        if ($pemesanan) {
            $payment = Payment::create([
                'kode_invoice' => 'INV-' . strtoupper(Str::random(8)),
                'pemesanan_id' => $pemesanan->id,
                'jumlah_bayar' => $validated['amount'],
                'metode_pembayaran' => $this->mapMethod($validated['paymentMethod']),
                'payment_type' => $validated['metadata']['paymentType'] ?? null,
                'status' => Payment::STATUS_PENDING,
                'paywuzz_order_id' => $validated['orderId'],
                'paywuzz_trx_id' => $trx['id'] ?? null,
                'payment_url' => $trx['paymentUrl'] ?? $trx['payment_url'] ?? null,
                'paywuzz_response' => json_encode($result),
            ]);
        }

        return response()->json([
            'message' => 'Transaksi PayWuzz berhasil dibuat.',
            'data' => $trx,
            'payment_id' => $payment?->id,
        ], 201);
    }

    public function getTransaction(Request $request, string $orderId): JsonResponse
    {
        $result = $this->paywuz->getTransaction($orderId);
        $trx = $result['data'] ?? $result;

        $payment = Payment::where('paywuzz_order_id', $orderId)->first();
        $status = strtolower($trx['status'] ?? '');

        if ($payment && in_array($status, ['settlement', 'success', 'paid'], true)) {
            $payment->update([
                'status' => Payment::STATUS_PAID,
                'waktu_pembayaran' => now(),
                'paywuzz_response' => json_encode($result),
            ]);

            $pemesanan = $payment->Pemesanan;
            if ($pemesanan) {
                $pemesanan->update(['status' => 'paid']);
            }
        }

        return response()->json([
            'message' => 'Status transaksi berhasil diambil.',
            'data' => $trx,
        ]);
    }

    // simulasi pembayaran sukses (demo tanpa API nyata)
    public function simulatePayment(string $orderId): JsonResponse
    {
        $payment = Payment::where('paywuzz_order_id', $orderId)->first();

        if (! $payment) {
            return response()->json([
                'message' => 'Transaksi tidak ditemukan.',
            ], 404);
        }

        DB::transaction(function () use ($payment) {
            $payment->update([
                'status' => Payment::STATUS_PAID,
                'waktu_pembayaran' => now(),
                'paywuzz_response' => json_encode(['simulated' => true]),
            ]);
            $pemesanan = $payment->Pemesanan;
            if ($pemesanan) {
                $pemesanan->update(['status' => 'paid']);
            }
        });

        return response()->json([
            'message' => 'Simulasi pembayaran berhasil.',
            'data' => ['status' => 'paid', 'orderId' => $orderId],
        ]);
    }

    public function callback(Request $request): JsonResponse
    {
        $orderId = $request->input('orderId') ?? $request->input('order_id');
        $status = strtolower($request->input('status', ''));

        if ($orderId && in_array($status, ['settlement', 'success', 'paid'], true)) {
            DB::transaction(function () use ($orderId) {
                $payment = Payment::where('paywuzz_order_id', $orderId)->first();
                if (! $payment) {
                    return;
                }
                $payment->update([
                    'status' => Payment::STATUS_PAID,
                    'waktu_pembayaran' => now(),
                    'paywuzz_response' => json_encode(request()->all()),
                ]);
                $pemesanan = $payment->Pemesanan;
                if ($pemesanan) {
                    $pemesanan->update(['status' => 'paid']);
                }
            });
        }

        return response()->json(['message' => 'OK']);
    }

    protected function mapMethod(string $method): string
    {
        return match (strtolower($method)) {
            'qris' => 'qris',
            'gopay', 'ovo', 'dana', 'shopeepay', 'ewallet' => 'ewallet',
            'credit_card', 'credit card' => 'credit_card',
            default => 'transfer_bank',
        };
    }
}
