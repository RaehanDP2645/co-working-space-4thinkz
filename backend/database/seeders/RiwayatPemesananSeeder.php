<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Pemesanan;
use App\Models\BookingHistory;

class RiwayatPemesananSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $b1 = Pemesanan::where('kode_pemesanan', 'RB-MRB001')->first();
        $b2 = Pemesanan::where('kode_pemesanan', 'RB-ES001')->first();
        $b3 = Pemesanan::where('kode_pemesanan', 'RB-MRB002')->first();
        $b4 = Pemesanan::where('kode_pemesanan', 'RB-PR001')->first();
        $b5 = Pemesanan::where('kode_pemesanan', 'RB-OS001')->first();



        $riwayat = [

            // RB-90234 : pending -> paid
            [
                'pemesanan_id' => $b1->id,
                'status_sebelumnya' => null,
                'status_sekarang' => 'pending',
                'waktu_perubahan' => '2026-06-29 08:00:00',
            ],

            [
                'pemesanan_id' => $b1->id,
                'status_sebelumnya' => 'pending',
                'status_sekarang' => 'paid',
                'waktu_perubahan' => '2026-06-29 08:30:00',
            ],



            // RB-82741 : pending
            [
                'pemesanan_id' => $b2->id,
                'status_sebelumnya' => null,
                'status_sekarang' => 'pending',
                'waktu_perubahan' => '2026-06-29 13:00:00',
            ],



            // RB-12345 : pending -> confirmed
            [
                'pemesanan_id' => $b3->id,
                'status_sebelumnya' => null,
                'status_sekarang' => 'pending',
                'waktu_perubahan' => '2026-06-30 09:00:00',
            ],

            [
                'pemesanan_id' => $b3->id,
                'status_sebelumnya' => 'pending',
                'status_sekarang' => 'confirmed',
                'waktu_perubahan' => '2026-06-30 09:30:00',
            ],



            // RB-45678 : pending -> confirmed -> completed
            [
                'pemesanan_id' => $b4->id,
                'status_sebelumnya' => null,
                'status_sekarang' => 'pending',
                'waktu_perubahan' => '2026-06-28 12:00:00',
            ],

            [
                'pemesanan_id' => $b4->id,
                'status_sebelumnya' => 'pending',
                'status_sekarang' => 'confirmed',
                'waktu_perubahan' => '2026-06-28 12:30:00',
            ],

            [
                'pemesanan_id' => $b4->id,
                'status_sebelumnya' => 'confirmed',
                'status_sekarang' => 'completed',
                'waktu_perubahan' => '2026-06-28 14:00:00',
            ],



            // RB-98765 : pending -> cancelled
            [
                'pemesanan_id' => $b5->id,
                'status_sebelumnya' => null,
                'status_sekarang' => 'pending',
                'waktu_perubahan' => '2026-06-27 14:00:00',
            ],

            [
                'pemesanan_id' => $b5->id,
                'status_sebelumnya' => 'pending',
                'status_sekarang' => 'cancelled',
                'waktu_perubahan' => '2026-06-27 17:00:00',
            ],

        ];


        foreach ($riwayat as $data) {

            BookingHistory::create($data);

        }
    }
}