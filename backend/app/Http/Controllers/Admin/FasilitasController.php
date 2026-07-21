<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\FasilitasRequest;
use App\Http\Resources\FasilitasResource;
use App\Models\Fasilitas;
use Illuminate\Http\JsonResponse;

class FasilitasController extends Controller
{
    public function index(): JsonResponse
    {
        $fasilitas = Fasilitas::query()->latest()->get();

        return response()->json([
            'message' => 'Daftar fasilitas berhasil diambil.',
            'data' => FasilitasResource::collection($fasilitas),
        ]);
    }

    public function store(FasilitasRequest $request): JsonResponse
    {
        $fasilitas = Fasilitas::create($request->validated());

        return response()->json([
            'message' => 'Fasilitas berhasil ditambahkan.',
            'data' => new FasilitasResource($fasilitas),
        ], 201);
    }

    public function show(Fasilitas $fasilitas): JsonResponse
    {
        return response()->json([
            'message' => 'Detail fasilitas berhasil diambil.',
            'data' => new FasilitasResource($fasilitas),
        ]);
    }

    public function update(FasilitasRequest $request, Fasilitas $fasilitas): JsonResponse
    {
        $fasilitas->update($request->validated());

        return response()->json([
            'message' => 'Fasilitas berhasil diperbarui.',
            'data' => new FasilitasResource($fasilitas->fresh()),
        ]);
    }

    public function destroy(Fasilitas $fasilitas): JsonResponse
    {
        $fasilitas->delete();

        return response()->json([
            'message' => 'Fasilitas berhasil dihapus.',
        ]);
    }
}
