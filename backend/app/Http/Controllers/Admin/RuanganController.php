<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ruangan;
use Illuminate\Support\Facades\Storage;

class RuanganController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ruangan = Ruangan::with('fasilitas')
            ->latest()
            ->get();


        return response()->json($ruangan);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_ruangan' => 'required|string|max:100',

            'jenis_ruangan' => 'required',

            'kapasitas' => 'required|integer',

            'harga_per_jam' => 'required|numeric',

            'gambar' => 'nullable|image|max:2048',

            'deskripsi' => 'nullable|string',

            'tingkat_privasi' => 'required',

            'mendukung_presentasi' => 'boolean',

            'mendukung_event' => 'boolean',
        ]);

        // Upload gambar
        if ($request->hasFile('gambar')) {

            $validated['gambar'] =
                $request->file('gambar')
                ->store('ruangan', 'public');

        }

        Ruangan::create($validated);

        return response()->json([
            'message'=>'Ruangan berhasil dibuat'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Ruangan $ruangan)
    {
        return response()->json(
            $ruangan->load('fasilitas')
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ruangan $ruangan)
    {
        $validated = $request->validate([
            'nama_ruangan' => 'required|string|max:100',

            'jenis_ruangan' => 'required',

            'kapasitas' => 'required|integer',

            'harga_per_jam' => 'required|numeric',

            'gambar' => 'nullable|image|max:2048',

            'deskripsi' => 'nullable|string',

            'tingkat_privasi' => 'required',

            'mendukung_presentasi' => 'boolean',

            'mendukung_event' => 'boolean',
        ]);

        if ($request->hasFile('gambar')) {

            // hapus gambar lama
            if ($ruangan->gambar) {

                Storage::disk('public')
                    ->delete($ruangan->gambar);

            }

            // simpan gambar baru
            $validated['gambar'] =
                $request->file('gambar')
                ->store('ruangan','public');
        }

        $ruangan->update($validated);

        return response()->json([
            'message'=>'Ruangan berhasil diperbarui'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ruangan $ruangan)
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
