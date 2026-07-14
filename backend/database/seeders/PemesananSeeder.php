<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Booking;
use App\Models\Ruangan;
use App\Models\User;

class PemesananSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dewi  = User::where('email', 'dewi@example.com')->first();
        $reza  = User::where('email', 'reza@example.com')->first();
        $prita = User::where('email', 'prita@example.com')->first();
        $dimas = User::where('email', 'dimas@example.com')->first();

        $meetingA = Ruangan::where('nama_ruangan', 'Meeting Room A')->first();
        $meetingB = Ruangan::where('nama_ruangan', 'Meeting Room B')->first();
        $private  = Ruangan::where('nama_ruangan', 'Private Office')->first();
        $open     = Ruangan::where('nama_ruangan', 'Open Space')->first();
        $event    = Ruangan::where('nama_ruangan', 'Event Space')->first();

        $pemesanan = [
            [
                'pengguna_id'  => $dewi->id,
                'ruangan_id'   => $meetingA->id,
                'waktu_mulai'  => '2026-07-01 09:00:00',
                'waktu_selesai'=> '2026-07-01 11:00:00',
                'status'       => Booking::STATUS_SELESAI,
                'total_biaya'  => 300000, // 2 jam x 150.000
            ],
            [
                'pengguna_id'  => $reza->id,
                'ruangan_id'   => $open->id,
                'waktu_mulai'  => '2026-07-01 10:00:00',
                'waktu_selesai'=> '2026-07-01 18:00:00',
                'status'       => Booking::STATUS_SELESAI,
                'total_biaya'  => 1600000, // 8 jam x 200.000
            ],
            [
                'pengguna_id'  => $prita->id,
                'ruangan_id'   => $meetingB->id,
                'waktu_mulai'  => '2026-07-02 13:00:00',
                'waktu_selesai'=> '2026-07-02 15:00:00',
                'status'       => Booking::STATUS_DIKONFIRMASI,
                'total_biaya'  => 500000, // 2 jam x 250.000
            ],
            [
                'pengguna_id'  => $dimas->id,
                'ruangan_id'   => $private->id,
                'waktu_mulai'  => '2026-07-02 08:00:00',
                'waktu_selesai'=> '2026-07-02 17:00:00',
                'status'       => Booking::STATUS_DIKONFIRMASI,
                'total_biaya'  => 675000, // 9 jam x 75.000
            ],
            [
                'pengguna_id'  => $dewi->id,
                'ruangan_id'   => $event->id,
                'waktu_mulai'  => '2026-07-05 08:00:00',
                'waktu_selesai'=> '2026-07-05 12:00:00',
                'status'       => Booking::STATUS_MENUNGGU,
                'total_biaya'  => 2000000, // 4 jam x 500.000
            ],
        ];

        foreach ($pemesanan as $data) {
            Booking::create($data);
        }
    }
}
