<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RekomendasiRuangan;
use App\Services\ForwardChainingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RekomendasiController extends Controller
{
    public function recommend(Request $request, ForwardChainingService $engine): JsonResponse
    {
        $validated = $request->validate([
            'jumlah_peserta'   => ['required', 'integer', 'min:1', 'max:500'],
            'jenis_aktivitas'  => ['required', 'string', 'in:meeting,presentasi,event,kerja individu,kerja tim,event besar'],
            'anggaran'         => ['required', 'numeric', 'min:0'],
            'tingkat_privasi'  => ['required', 'string', 'in:publik,semi_private,private'],
            'butuh_presentasi' => ['nullable', 'boolean'],
            'butuh_event'      => ['nullable', 'boolean'],
        ]);

        $validated['butuh_presentasi'] = $validated['butuh_presentasi'] ?? false;
        $validated['butuh_event'] = $validated['butuh_event'] ?? false;

        $results = $engine->recommend($validated);

        foreach ($results as $result) {
            if (Auth::check()) {
                RekomendasiRuangan::create([
                    'user_id'            => Auth::id(),
                    'ruangan_id'         => $result['room']->id,
                    'jumlah_peserta'     => $validated['jumlah_peserta'],
                    'jenis_aktivitas'    => $validated['jenis_aktivitas'],
                    'anggaran'           => $validated['anggaran'],
                    'tingkat_privasi'    => $validated['tingkat_privasi'],
                    'alasan_rekomendasi' => $result['penjelasan'],
                    'skor_rekomendasi'   => $result['skor'],
                ]);
            }
        }

        $mapped = array_map(fn($r) => [
            'id'         => $r['room']->id,
            'nama'       => $r['room']->nama_ruangan,
            'jenis'      => $r['room']->jenis_ruangan,
            'kapasitas'  => $r['room']->kapasitas,
            'harga'      => (float) $r['room']->harga_per_jam,
            'privasi'    => $r['room']->tingkat_privasi,
            'gambar_url' => $r['room']->gambar_url,
            'fasilitas'  => $r['room']->fasilitas->pluck('nama_fasilitas'),
            'skor'       => $r['skor'],
            'skor_raw'   => $r['skor_raw'],
            'alasan'     => $r['alasan'],
            'penjelasan' => $r['penjelasan'],
        ], $results);

        return response()->json([
            'message' => 'Rekomendasi berhasil dihasilkan.',
            'data' => $mapped,
        ]);
    }

    public function history(): JsonResponse
    {
        $history = RekomendasiRuangan::with('ruangan')
            ->where('user_id', Auth::id())
            ->latest()
            ->limit(10)
            ->get();

        return response()->json([
            'data' => $history,
        ]);
    }
}
