<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Models\Pemesanan;
use App\Models\Ruangan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class PemesananController extends Controller
{
    public function index(): JsonResponse
    {
        $pemesanan = Pemesanan::with('room')
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return response()->json([
            'message' => 'Daftar reservasi berhasil diambil.',
            'data' => BookingResource::collection($pemesanan),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ruangan_id' => ['required', 'exists:ruangan,id'],
            'date' => ['required', 'string'],
            'time' => ['required', 'string'],
            'jumlah_orang' => ['nullable', 'integer', 'min:1'],
            'catatan' => ['nullable', 'string'],
            'nama' => ['nullable', 'string'],
            'email' => ['nullable', 'email'],
            'hp' => ['nullable', 'string'],
        ]);

        $ruangan = Ruangan::findOrFail($validated['ruangan_id']);

        $start = \Carbon\Carbon::createFromFormat('Y-m-d H.i', $validated['date'] . ' ' . substr($validated['time'], 0, 5));
        $end = $start->copy()->addHour();

        $prefixMap = [
            'Meeting Room' => 'MR',
            'Private Office' => 'PR',
            'Open Space' => 'OS',
            'Event Space' => 'ES',
        ];
        $prefix = $prefixMap[$ruangan->jenis_ruangan] ?? 'RB';
        $last = Pemesanan::where('kode_pemesanan', 'like', "RB-{$prefix}%")
            ->orderByDesc('id')
            ->first();
        $num = 1;
        if ($last) {
            $parts = explode('-', $last->kode_pemesanan);
            $lastNum = (int) end($parts);
            $num = $lastNum + 1;
        }
        $kode = "RB-{$prefix}" . str_pad($num, 3, '0', STR_PAD_LEFT);

        $pemesanan = Pemesanan::create([
            'kode_pemesanan' => $kode,
            'user_id' => Auth::id(),
            'ruangan_id' => $ruangan->id,
            'waktu_mulai' => $start,
            'waktu_selesai' => $end,
            'status' => Pemesanan::STATUS_MENUNGGU,
            'batas_pembayaran' => now()->addHours(24),
            'total_biaya' => $ruangan->harga_per_jam,
            'jumlah_orang' => $validated['jumlah_orang'] ?? null,
            'catatan' => $validated['catatan'] ?? null,
        ]);

        return response()->json([
            'message' => 'Reservasi berhasil dibuat.',
            'data' => new BookingResource($pemesanan->load('room')),
        ], 201);
    }

    public function show(Pemesanan $pemesanan): JsonResponse
    {
        if ($pemesanan->user_id !== Auth::id()) {
            abort(403);
        }

        return response()->json([
            'message' => 'Detail reservasi berhasil diambil.',
            'data' => new BookingResource($pemesanan->load('room')),
        ]);
    }

    public function destroy(Pemesanan $pemesanan): JsonResponse
    {
        if ($pemesanan->user_id !== Auth::id()) {
            abort(403);
        }

        // hanya bisa batalkan kalau belum dibayar
        if (! in_array($pemesanan->status, [Pemesanan::STATUS_MENUNGGU])) {
            return response()->json([
                'message' => 'Reservasi tidak dapat dibatalkan karena sudah dibayar.',
            ], 422);
        }

        $pemesanan->update(['status' => Pemesanan::STATUS_DIBATALKAN]);

        return response()->json([
            'message' => 'Reservasi berhasil dibatalkan.',
        ]);
    }
}
