<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FasilitasResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nama_fasilitas' => $this->nama_fasilitas,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
