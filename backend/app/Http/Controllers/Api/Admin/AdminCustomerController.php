<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pemesanan;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminCustomerController extends Controller
{
    // list customers + stats
    public function index(Request $request): JsonResponse
    {
        $customers = User::where('role', User::ROLE_USER)
            ->get()
            ->map(function ($u) {
                $bookings = Pemesanan::where('user_id', $u->id)->get();
                $paid = Payment::where('status', Payment::STATUS_PAID)
                    ->whereHas('Pemesanan', function ($q) use ($u) {
                        $q->where('user_id', $u->id);
                    })->sum('jumlah_bayar');

                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'status' => $u->status ?? 'Aktif',
                    'bookingCount' => $bookings->count(),
                    'totalSpent' => (int) $paid,
                    'bookings' => $bookings->map(function ($b) {
                        return [
                            'id' => $b->id,
                            'code' => $b->kode_pemesanan,
                            'room' => ['name' => $b->room ? $b->room->nama_ruangan : '-'],
                            'date' => $b->waktu_mulai ? $b->waktu_mulai->format('d M Y') : '-',
                            'time' => $b->waktu_mulai ? $b->waktu_mulai->format('H.i') : '-',
                            'status' => $b->status,
                        ];
                    }),
                ];
            });

        return response()->json([
            'message' => 'Daftar pelanggan berhasil diambil.',
            'data' => $customers,
        ]);
    }
}
