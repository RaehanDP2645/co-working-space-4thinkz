<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $room = $this->whenLoaded('room');
        return [
            'id' => $this->id,
            'code' => $this->kode_pemesanan,
            'room' => $room ? [
                'id' => $room->id,
                'name' => $room->nama_ruangan,
                'cap' => $room->kapasitas,
                'price' => (int) $room->harga_per_jam,
                'img' => $room->gambar_url,
            ] : null,
            'date' => $this->waktu_mulai ? $this->waktu_mulai->format('d F Y') : null,
            'time' => $this->waktu_mulai && $this->waktu_selesai
                ? $this->waktu_mulai->format('H.i') . ' - ' . $this->waktu_selesai->format('H.i')
                : null,
            'status' => $this->status,
            'batas_pembayaran' => $this->batas_pembayaran ? $this->batas_pembayaran->toDateTimeString() : null,
            'is_expired' => $this->batas_pembayaran ? $this->batas_pembayaran->isPast() : false,
            'total_biaya' => $this->total_biaya,
            'jumlah_orang' => $this->jumlah_orang,
            'catatan' => $this->catatan,
            'created_at' => $this->created_at,
        ];
    }
}
