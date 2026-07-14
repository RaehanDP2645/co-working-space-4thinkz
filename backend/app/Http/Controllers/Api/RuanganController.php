<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ruangan;
use App\Http\Requests\RuanganRequest;
use Illuminate\Http\JsonResponse;

class RuanganController extends Controller
{
    /**
     * Daftar semua ruangan
     */
    public function index(): JsonResponse
    {
        $Rooms = Ruangan::query()->latest()->get();

        return response()->json([
            'message' => 'Daftar ruangan berhasil diambil.',
            'data' => $Rooms,
        ]);
    }

    /**
     * Detail ruangan
     */
    public function show(Ruangan $Rooms): JsonResponse
    {
        return response()->json([
            'message' => 'Detail ruangan berhasil diambil.',
            'data' => $Rooms,
        ]);
    }

    /**
     * Tambah ruangan baru
     */
    public function store(RuanganRequest $request): JsonResponse
    {
        $Rooms = Ruangan::create($request->validated());

        return response()->json([
            'message' => 'Ruangan berhasil ditambahkan.',
            'data' => $Rooms,
        ]);
    }

    /**
     * Update ruangan
     */
    public function update(RuanganRequest $request, Ruangan $Rooms): JsonResponse
    {
        $Rooms->update($request->validated());

        return response()->json([
            'message' => 'Ruangan berhasil diperbarui.',
            'data' => $Rooms->fresh(),
        ]);
    }

    /**
     * hapus ruangan
     */
    public function destroy(Ruangan $Rooms): JsonResponse
    {
        $Rooms->delete();

        return response()->json([
            'message' => 'Ruangan berhasil dihapus.',
        ]);
    }
}
