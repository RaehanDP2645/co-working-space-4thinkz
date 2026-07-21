<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Pemesanan;
use App\Models\Ruangan;
use App\Models\User;

class PemesananSeeder extends Seeder
{
    public function run(): void
    {
        $budi = User::where('email', 'budi@mail.com')->first();
        $ani  = User::where('email', 'ani@mail.com')->first();
        $rudi = User::where('email', 'rudi@mail.com')->first();
        $siti = User::where('email', 'siti@mail.com')->first();
        $dewi = User::where('email', 'dewi@mail.com')->first();

        $meetingB = Ruangan::where('nama_ruangan', 'Meeting Room B')->first();
        $private  = Ruangan::where('nama_ruangan', 'Private Office')->first();
        $open     = Ruangan::where('nama_ruangan', 'Open Space')->first();
        $event    = Ruangan::where('nama_ruangan', 'Event Space')->first();

        $fallback = Ruangan::first();
        $meetingB = $meetingB ?? $fallback;
        $private  = $private ?? $fallback;
        $open     = $open ?? $fallback;
        $event    = $event ?? $fallback;

        $prefixMap = [
            'Meeting Room A' => 'MRA',
            'Meeting Room B' => 'MRB',
            'Private Office' => 'PR',
            'Open Space' => 'OS',
            'Event Space' => 'ES',
        ];
        $counters = [];
        $genCode = function ($ruangan) use (&$prefixMap, &$counters) {
            $prefix = $prefixMap[$ruangan->nama_ruangan] ?? 'RB';
            $counters[$prefix] = ($counters[$prefix] ?? 0) + 1;
            return 'RB-' . $prefix . str_pad($counters[$prefix], 3, '0', STR_PAD_LEFT);
        };

        $pemesanan = [
            [
                'kode_pemesanan' => $genCode($meetingB),
                'user_id' => $budi->id,
                'ruangan_id' => $meetingB->id,
                'waktu_mulai' => '2026-06-29 09:00:00',
                'waktu_selesai' => '2026-06-29 11:00:00',
                'jumlah_orang' => 10,
                'status' => 'paid',
                'total_biaya' => 300000,
            ],
            [
                'kode_pemesanan' => $genCode($event),
                'user_id' => $ani->id,
                'ruangan_id' => $event->id,
                'waktu_mulai' => '2026-06-29 14:00:00',
                'waktu_selesai' => '2026-06-29 16:00:00',
                'jumlah_orang' => 20,
                'status' => 'pending',
                'total_biaya' => 1000000,
            ],
            [
                'kode_pemesanan' => $genCode($meetingB),
                'user_id' => $rudi->id,
                'ruangan_id' => $meetingB->id,
                'waktu_mulai' => '2026-06-30 10:00:00',
                'waktu_selesai' => '2026-06-30 12:00:00',
                'jumlah_orang' => 8,
                'status' => 'confirmed',
                'total_biaya' => 500000,
            ],
            [
                'kode_pemesanan' => $genCode($private),
                'user_id' => $siti->id,
                'ruangan_id' => $private->id,
                'waktu_mulai' => '2026-06-28 13:00:00',
                'waktu_selesai' => '2026-06-28 14:00:00',
                'jumlah_orang' => 2,
                'status' => 'completed',
                'total_biaya' => 75000,
            ],
            [
                'kode_pemesanan' => $genCode($open),
                'user_id' => $dewi->id,
                'ruangan_id' => $open->id,
                'waktu_mulai' => '2026-06-27 15:00:00',
                'waktu_selesai' => '2026-06-27 17:00:00',
                'jumlah_orang' => 15,
                'status' => 'cancelled',
                'total_biaya' => 400000,
            ],
        ];

        foreach ($pemesanan as $data) {
            Pemesanan::updateOrCreate(
                ['kode_pemesanan' => $data['kode_pemesanan']],
                $data
            );
        }
    }
}
