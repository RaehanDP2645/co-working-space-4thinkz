<?php

namespace App\Http\Controllers\Api;

use App\Models\Ruangan;
use App\Http\Controllers\Controller;
use App\Http\Resources\RuanganResource;
use Illuminate\Http\JsonResponse;

class RuanganController extends Controller
{
    public function index(): JsonResponse
    {
        $ruangan = Ruangan::with('fasilitas')->latest()->get();

        return response()->json([
            'message' => 'Daftar ruangan berhasil diambil.',
            'data' => RuanganResource::collection($ruangan),
        ]);
    }

    public function show(Ruangan $ruangan): JsonResponse
    {
        return response()->json([
            'message' => 'Detail ruangan berhasil diambil.',
            'data' => new RuanganResource($ruangan->load('fasilitas')),
        ]);
    }

    /**
     * Tambah ruangan baru
     */
    public function store(Request $request): JsonResponse
    {
        $data = $this->validatedRoom($request);
        $data['gambar'] = $this->resolveGambar($request);
        $data['status'] = $request->input('status', 'tersedia');

        $room = Ruangan::create($data);

        return response()->json([
            'message' => 'Ruangan berhasil ditambahkan.',
            'data' => new RuanganResource($room->load('fasilitas')),
        ]);
    }

    /**
     * Update ruangan
     */
    public function update(Request $request, Ruangan $ruangan): JsonResponse
    {
        $data = $this->validatedRoom($request, $ruangan->id);
        $gambar = $this->resolveGambar($request);
        if ($gambar !== null) {
            $data['gambar'] = $gambar;
        }
        if ($request->has('status')) {
            $data['status'] = $request->input('status');
        }

        $ruangan->update($data);

        return response()->json([
            'message' => 'Ruangan berhasil diperbarui.',
            'data' => new RuanganResource($ruangan->fresh()->load('fasilitas')),
        ]);
    }

    /**
     * hapus ruangan
     */
    public function destroy(Ruangan $ruangan): JsonResponse
    {
        $ruangan->delete();

        return response()->json([
            'message' => 'Ruangan berhasil dihapus.',
        ]);
    }

    private function validatedRoom(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'nama_ruangan' => 'required|string|max:255',
            'kapasitas' => 'required|integer|min:1',
            'harga_per_jam' => 'required|numeric|min:0',
            'deskripsi' => 'nullable|string',
            'lokasi' => 'nullable|string|max:255',
            'tingkat_privasi' => 'nullable|string|max:50',
            'fasilitas' => 'nullable|array',
            'fasilitas.*' => 'string',
        ]);
    }

    private function resolveGambar(Request $request): ?string
    {
        if ($request->hasFile('gambar_file')) {
            $file = $request->file('gambar_file');
            $name = 'room_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/rooms', $name);
            return 'rooms/' . $name;
        }
        if ($request->filled('gambar_url')) {
            return $request->input('gambar_url');
        }
        if ($request->has('gambar') && is_string($request->input('gambar'))) {
            return $request->input('gambar');
        }
        return null;
    }
}
