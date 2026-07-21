<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\FasilitasResource;
use App\Models\Fasilitas;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

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

    public function show(Fasilitas $fasilitas): JsonResponse
    {
        return response()->json([
            'message' => 'Detail fasilitas berhasil diambil.',
            'data' => new FasilitasResource($fasilitas),
        ]);
    }
}
