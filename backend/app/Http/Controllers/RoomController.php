<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Room;
use App\Http\Requests\RoomRequest;
use Illuminate\Http\JsonResponse;

class RoomController extends Controller
{
    /**
     * Daftar semua ruangan
     */
    public function index(): JsonResponse
    {
        $rooms = Room::query()->latest()->get();

        return response()->json([
            'message' => 'Daftar ruangan berhasil diambil.',
            'data' => $rooms,
        ]);
    }

    /**
     * Detail ruangan
     */
    public function show(Room $room): JsonResponse
    {
        return response()->json([
            'message' => 'Detail ruangan berhasil diambil.',
            'data' => $room,
        ]);
    }

    /**
     * Tambah ruangan baru
     */
    public function store(RoomRequest $request): JsonResponse
    {
        $room = Room::create($request->validated());

        return response()->json([
            'message' => 'Ruangan berhasil ditambahkan.',
            'data' => $room,
        ]);
    }

    /**
     * Update ruangan
     */
    public function update(RoomRequest $request, Room $room): JsonResponse
    {
        $room->update($request->validated());

        return response()->json([
            'message' => 'Ruangan berhasil diperbarui.',
            'data' => $room->fresh(),
        ]);
    }

    /**
     * hapus ruangan
     */
    public function destroy(Room $room): JsonResponse
    {
        $room->delete();

        return response()->json([
            'message' => 'Ruangan berhasil dihapus.',
        ]);
    }
}
