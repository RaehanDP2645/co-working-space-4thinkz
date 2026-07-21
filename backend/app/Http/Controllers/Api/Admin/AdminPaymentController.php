<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Pemesanan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminPaymentController extends Controller
{
    // list all payments
    public function index(Request $request): JsonResponse
    {
        $payments = Payment::with('Pemesanan.user')
            ->latest()
            ->get()
            ->map(function ($p) {
                $booking = $p->Pemesanan;
                return [
                    'id' => $p->id,
                    'invoice' => $p->kode_invoice,
                    'bookingCode' => $booking ? $booking->kode_pemesanan : '-',
                    'customerName' => $booking && $booking->user ? $booking->user->name : '-',
                    'customerEmail' => $booking && $booking->user ? $booking->user->email : '-',
                    'amount' => (int) $p->jumlah_bayar,
                    'method' => $p->metode_pembayaran ?? 'Manual Bank Transfer',
                    'status' => $p->status,
                    'date' => $p->waktu_pembayaran ? $p->waktu_pembayaran->format('d M Y') : ($p->created_at ? $p->created_at->format('d M Y') : '-'),
                ];
            });

        return response()->json([
            'message' => 'Daftar pembayaran berhasil diambil.',
            'data' => $payments,
        ]);
    }

    // verifikasi pembayaran manual
    public function verify(Request $request, $id): JsonResponse
    {
        $payment = Payment::findOrFail($id);
        $payment->update([
            'status' => Payment::STATUS_PAID,
            'waktu_pembayaran' => $payment->waktu_pembayaran ?? now(),
        ]);

        if ($payment->Pemesanan) {
            $payment->Pemesanan->update(['status' => Pemesanan::STATUS_DIBAYAR]);
        }

        return response()->json([
            'message' => 'Pembayaran diverifikasi.',
            'data' => ['id' => $payment->id, 'status' => $payment->status],
        ]);
    }
}
