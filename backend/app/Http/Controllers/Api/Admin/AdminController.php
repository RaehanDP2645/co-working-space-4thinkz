<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pemesanan;
use App\Models\Payment;
use App\Models\Ruangan;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    // admin login
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password) || ! $user->isAdmin()) {
            return response()->json([
                'message' => 'Email atau password admin salah.',
            ], 401);
        }

        // single session: cabut semua token lama agar hanya 1 device login
        $user->tokens()->delete();
        $token = $user->createToken('admin-token')->plainTextToken;

        return response()->json([
            'message' => 'Login admin berhasil.',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    // get current admin
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
                'email' => $request->user()->email,
            ],
        ]);
    }

    // dashboard statistik
    public function dashboard(Request $request): JsonResponse
    {
        $payments = Payment::all();

        $bookingsToday = Pemesanan::whereDate('waktu_mulai', now()->format('Y-m-d'))->count();
        $bookingsPending = Pemesanan::where('status', Pemesanan::STATUS_MENUNGGU)->count();
        $bookingsCompleted = Pemesanan::where('status', Pemesanan::STATUS_SELESAI)->count();

        $revenueToday = $payments->filter(function ($p) {
            return $p->status === Payment::STATUS_PAID
                && $p->waktu_pembayaran
                && $p->waktu_pembayaran->format('Y-m-d') === now()->format('Y-m-d');
        })->sum('jumlah_bayar');

        $revenueMonth = $payments->filter(function ($p) {
            return $p->status === Payment::STATUS_PAID;
        })->sum('jumlah_bayar');

        $totalCustomers = User::where('role', User::ROLE_USER)->count();
        $totalRooms = Ruangan::count();
        $activeRooms = Pemesanan::whereIn('status', [Pemesanan::STATUS_DIBAYAR, Pemesanan::STATUS_DIKONFIRMASI])
            ->distinct('ruangan_id')->count('ruangan_id');

        // booking 7 hari terakhir (per hari)
        $weeklyBookings = [];
        for ($i = 6; $i >= 0; $i--) {
            $day = now()->subDays($i);
            $weeklyBookings[] = [
                'label' => $day->format('D'),
                'date' => $day->format('Y-m-d'),
                'count' => Pemesanan::whereDate('waktu_mulai', $day->format('Y-m-d'))->count(),
            ];
        }

        // pendapatan 6 bulan terakhir (per bulan)
        $monthlyRevenue = [];
        for ($i = 5; $i >= 0; $i--) {
            $m = now()->subMonths($i);
            $start = $m->copy()->startOfMonth();
            $end = $m->copy()->endOfMonth();
            $amt = Payment::where('status', Payment::STATUS_PAID)
                ->whereBetween('waktu_pembayaran', [$start, $end])
                ->sum('jumlah_bayar');
            $monthlyRevenue[] = [
                'label' => $m->format('M'),
                'month' => $m->format('Y-m'),
                'amount' => (int) $amt,
            ];
        }

        $recent = Pemesanan::with(['room', 'user'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($b) {
                return [
                    'id' => $b->id,
                    'code' => $b->kode_pemesanan,
                    'customerName' => $b->user ? $b->user->name : '-',
                    'room' => $b->room ? ['name' => $b->room->nama_ruangan] : ['name' => '-'],
                    'date' => $b->waktu_mulai ? $b->waktu_mulai->format('d M Y') : '-',
                    'status' => $b->status,
                ];
            });

        return response()->json([
            'message' => 'Statistik dashboard berhasil diambil.',
            'data' => [
                'totalCustomers' => $totalCustomers,
                'totalRooms' => $totalRooms,
                'bookingsToday' => $bookingsToday,
                'bookingsPending' => $bookingsPending,
                'bookingsCompleted' => $bookingsCompleted,
                'revenueToday' => (int) $revenueToday,
                'revenueMonth' => (int) $revenueMonth,
                'activeRooms' => $activeRooms,
                'weeklyBookings' => $weeklyBookings,
                'monthlyRevenue' => $monthlyRevenue,
                'recentBookings' => $recent,
            ],
        ]);
    }

    // laporan
    public function reports(Request $request): JsonResponse
    {
        $bookings = Pemesanan::with(['room', 'user'])->get()->map(function ($b) {
            return [
                'code' => $b->kode_pemesanan,
                'customerName' => $b->user ? $b->user->name : '-',
                'room' => ['name' => $b->room ? $b->room->nama_ruangan : '-'],
                'date' => $b->waktu_mulai ? $b->waktu_mulai->format('d M Y') : '-',
                'status' => $b->status,
            ];
        });

        $payments = Payment::with('Pemesanan')->get()->map(function ($p) {
            $booking = $p->Pemesanan;
            return [
                'invoice' => $p->kode_invoice,
                'bookingCode' => $booking ? $booking->kode_pemesanan : '-',
                'customerName' => $booking && $booking->user ? $booking->user->name : '-',
                'amount' => (int) $p->jumlah_bayar,
                'status' => $p->status,
            ];
        });

        $customers = User::where('role', User::ROLE_USER)->get()->map(function ($u) {
            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'status' => $u->status ?? 'Aktif',
            ];
        });

        $rooms = Ruangan::all()->map(function ($r) {
            return [
                'name' => $r->nama_ruangan,
                'type' => $r->jenis_ruangan,
                'cap' => $r->kapasitas,
                'price' => (int) $r->harga_per_jam,
                'status' => 'Aktif',
            ];
        });

        return response()->json([
            'message' => 'Laporan berhasil diambil.',
            'data' => [
                'bookings' => $bookings,
                'payments' => $payments,
                'customers' => $customers,
                'rooms' => $rooms,
            ],
        ]);
    }
}
