<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RuanganResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nama_ruangan' => $this->nama_ruangan,
            'jenis_ruangan' => $this->jenis_ruangan,
            'kapasitas' => $this->kapasitas,
            'harga_per_jam' => $this->harga_per_jam,
            'gambar' => $this->gambar,
            'gambar_url' => $this->gambar_url,
            'deskripsi' => $this->deskripsi,
            'tingkat_privasi' => $this->tingkat_privasi,
            'mendukung_presentasi' => $this->mendukung_presentasi,
            'mendukung_event' => $this->mendukung_event,
            'fasilitas' => FasilitasResource::collection($this->whenLoaded('fasilitas')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
