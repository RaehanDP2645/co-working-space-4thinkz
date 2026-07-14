<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Booking;
use App\Models\BookingHistory;
use App\Models\Ruangan;
use App\Models\User;

class RiwayatPemesananSeeder extends Seeder
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

        $b1 = Booking::where('pengguna_id', $dewi->id)->where('ruangan_id', $meetingA->id)->first();
        $b2 = Booking::where('pengguna_id', $reza->id)->where('ruangan_id', $open->id)->first();
        $b3 = Booking::where('pengguna_id', $prita->id)->where('ruangan_id', $meetingB->id)->first();
        $b4 = Booking::where('pengguna_id', $dimas->id)->where('ruangan_id', $private->id)->first();
        $b5 = Booking::where('pengguna_id', $dewi->id)->where('ruangan_id', $event->id)->first();

        $riwayat = [

            // b1: menunggu → dikonfirmasi → selesai
            ['pemesanan_id' => $b1->id, 'status_sebelumnya' => null,           'status_sekarang' => 'menunggu',     'waktu_perubahan' => '2026-07-01 07:00:00'],
            ['pemesanan_id' => $b1->id, 'status_sebelumnya' => 'menunggu',     'status_sekarang' => 'dikonfirmasi', 'waktu_perubahan' => '2026-07-01 08:00:00'],
            ['pemesanan_id' => $b1->id, 'status_sebelumnya' => 'dikonfirmasi', 'status_sekarang' => 'selesai',      'waktu_perubahan' => '2026-07-01 11:00:00'],

            // b2: menunggu → dikonfirmasi → selesai
            ['pemesanan_id' => $b2->id, 'status_sebelumnya' => null,           'status_sekarang' => 'menunggu',     'waktu_perubahan' => '2026-07-01 08:00:00'],
            ['pemesanan_id' => $b2->id, 'status_sebelumnya' => 'menunggu',     'status_sekarang' => 'dikonfirmasi', 'waktu_perubahan' => '2026-07-01 09:00:00'],
            ['pemesanan_id' => $b2->id, 'status_sebelumnya' => 'dikonfirmasi', 'status_sekarang' => 'selesai',      'waktu_perubahan' => '2026-07-01 18:00:00'],

            // b3: menunggu → dikonfirmasi (belum selesai)
            ['pemesanan_id' => $b3->id, 'status_sebelumnya' => null,       'status_sekarang' => 'menunggu',     'waktu_perubahan' => '2026-07-02 10:00:00'],
            ['pemesanan_id' => $b3->id, 'status_sebelumnya' => 'menunggu', 'status_sekarang' => 'dikonfirmasi', 'waktu_perubahan' => '2026-07-02 12:30:00'],

            // b4: menunggu → dikonfirmasi (belum selesai)
            ['pemesanan_id' => $b4->id, 'status_sebelumnya' => null,       'status_sekarang' => 'menunggu',     'waktu_perubahan' => '2026-07-02 07:00:00'],
            ['pemesanan_id' => $b4->id, 'status_sebelumnya' => 'menunggu', 'status_sekarang' => 'dikonfirmasi', 'waktu_perubahan' => '2026-07-02 07:30:00'],

            // b5: baru masuk, masih menunggu — 1 baris log saja
            ['pemesanan_id' => $b5->id, 'status_sebelumnya' => null, 'status_sekarang' => 'menunggu', 'waktu_perubahan' => '2026-07-03 09:00:00'],
        ];

        foreach ($riwayat as $data) {
            BookingHistory::create($data);
        }
    }
}
