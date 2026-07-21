<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pemesanan;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminBookingController extends Controller
{
    // list all bookings
    public function index(Request $request): JsonResponse
    {
        $bookings = Pemesanan::with(['room', 'user', 'payments'])
            ->latest()
            ->get()
            ->map(function ($b) {
                $payment = $b->payments->first();
                return [
                    'id' => $b->id,
                    'code' => $b->kode_pemesanan,
                    'customerName' => $b->user ? $b->user->name : '-',
                    'customerEmail' => $b->user ? $b->user->email : '-',
                    'room' => $b->room ? [
                        'id' => $b->room->id,
                        'name' => $b->room->nama_ruangan,
                        'cap' => $b->room->kapasitas,
                        'price' => (int) $b->room->harga_per_jam,
                        'img' => $b->room->gambar_url,
                    ] : ['name' => '-'],
                    'date' => $b->waktu_mulai ? $b->waktu_mulai->format('d M Y') : '-',
                    'time' => $b->waktu_mulai && $b->waktu_selesai
                        ? $b->waktu_mulai->format('H.i') . ' - ' . $b->waktu_selesai->format('H.i')
                        : '-',
                    'capacity' => $b->jumlah_orang,
                    'status' => $b->status,
                    'paymentMethod' => $payment ? $payment->metode_pembayaran : 'Manual Bank Transfer',
                ];
            });

        return response()->json([
            'message' => 'Daftar booking berhasil diambil.',
            'data' => $bookings,
        ]);
    }

    // update status booking
    public function updateStatus(Request $request, $id): JsonResponse
    {
        $request->validate([
            'status' => ['required', 'string', 'in:pending,paid,confirmed,completed,cancelled'],
        ]);

        $booking = Pemesanan::findOrFail($id);
        $booking->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Status booking diperbarui.',
            'data' => ['id' => $booking->id, 'status' => $booking->status],
        ]);
    }

    // batalkan booking
    public function cancel(Request $request, $id): JsonResponse
    {
        $booking = Pemesanan::findOrFail($id);
        $booking->update(['status' => Pemesanan::STATUS_DIBATALKAN]);

        return response()->json([
            'message' => 'Booking dibatalkan.',
            'data' => ['id' => $booking->id, 'status' => $booking->status],
        ]);
    }
}
