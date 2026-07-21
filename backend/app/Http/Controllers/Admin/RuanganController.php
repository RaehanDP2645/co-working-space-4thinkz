<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Models\Ruangan;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\RuanganRequest;
use App\Http\Resources\RuanganResource;

class RuanganController extends Controller
{
    public function index()
    {
        $ruangan = Ruangan::with('fasilitas')
            ->latest()
            ->get();


        return response()->json([
            'message' => 'Daftar ruangan berhasil diambil.',
            'data' => RuanganResource::collection($ruangan),
        ]);
    }

    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RuanganRequest $request)
    {
        $data = $request->validated();
        $fasilitas = $data['fasilitas'] ?? [];
        unset($data['fasilitas']);

        // Upload gambar (file lokal) ATAU gunakan URL internet
        if ($request->hasFile('gambar')) {
            $data['gambar'] = $request->file('gambar')
                ->store('ruangan', 'public');
        } elseif ($request->filled('gambar_url')) {
            $data['gambar'] = $request->input('gambar_url');
        } else {
            unset($data['gambar']);
        }

        $ruangan = Ruangan::create($data);
        $ruangan->fasilitas()->sync($fasilitas);

        return response()->json([
            'message' => 'Ruangan berhasil dibuat.',
            'data' => new RuanganResource($ruangan->load('fasilitas')),
        ], 201);
    }

    
    public function show(Ruangan $ruangan): JsonResponse
    {
        return response()->json([
            'message' => 'Detail ruangan berhasil diambil.',
            'data' => new RuanganResource($ruangan->load('fasilitas')),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    
    public function update(RuanganRequest $request, Ruangan $ruangan): JsonResponse
    {
        $data = $request->validated();
        $fasilitas = $data['fasilitas'] ?? [];
        unset($data['fasilitas']);

        if ($request->hasFile('gambar')) {

            // hapus gambar lama
            if ($ruangan->gambar && !filter_var($ruangan->gambar, FILTER_VALIDATE_URL)) {
                Storage::disk('public')
                    ->delete($ruangan->gambar);
            }

            // simpan gambar baru
            $data['gambar'] =
                $request->file('gambar')
                ->store('ruangan','public');
        } elseif ($request->filled('gambar_url')) {
            if ($ruangan->gambar && !filter_var($ruangan->gambar, FILTER_VALIDATE_URL)) {
                Storage::disk('public')
                    ->delete($ruangan->gambar);
            }
            $data['gambar'] = $request->input('gambar_url');
        } else {
            unset($data['gambar']);
        }

        $ruangan->update($data);
        $ruangan->fasilitas()->sync($fasilitas);

        return response()->json([
            'message' => 'Ruangan berhasil diperbarui.',
            'data' => new RuanganResource($ruangan->load('fasilitas')),
        ]);
    }

    public function destroy(Ruangan $ruangan): JsonResponse
    {
        if($ruangan->gambar){
            Storage::disk('public')
                ->delete($ruangan->gambar);
        }
        $ruangan->delete();

        return response()->json([
            'message'=>'Ruangan berhasil dihapus'
        ]);
    }
}
