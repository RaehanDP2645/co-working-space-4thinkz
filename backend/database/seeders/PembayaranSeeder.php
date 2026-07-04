<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\Room;
use App\Models\User;

class PembayaranSeeder extends Seeder
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

        $meetingA = Room::where('nama_ruangan', 'Meeting Room A')->first();
        $meetingB = Room::where('nama_ruangan', 'Meeting Room B')->first();
        $private  = Room::where('nama_ruangan', 'Private Office')->first();
        $open     = Room::where('nama_ruangan', 'Open Space')->first();
        $event    = Room::where('nama_ruangan', 'Event Space')->first();

        $b1 = Booking::where('pengguna_id', $dewi->id)->where('ruangan_id', $meetingA->id)->first();
        $b2 = Booking::where('pengguna_id', $reza->id)->where('ruangan_id', $open->id)->first();
        $b3 = Booking::where('pengguna_id', $prita->id)->where('ruangan_id', $meetingB->id)->first();
        $b4 = Booking::where('pengguna_id', $dimas->id)->where('ruangan_id', $private->id)->first();
        $b5 = Booking::where('pengguna_id', $dewi->id)->where('ruangan_id', $event->id)->first();

        $pembayaran = [
            [
                'pemesanan_id'       => $b1->id,
                'jumlah_bayar'       => 300000,
                'metode_pembayaran'  => 'transfer',
                'status'             => Payment::STATUS_LUNAS,
                'waktu_pembayaran'   => '2026-07-01 08:30:00',
            ],
            [
                'pemesanan_id'       => $b2->id,
                'jumlah_bayar'       => 1600000,
                'metode_pembayaran'  => 'e_wallet',
                'status'             => Payment::STATUS_LUNAS,
                'waktu_pembayaran'   => '2026-07-01 09:45:00',
            ],
            [
                'pemesanan_id'       => $b3->id,
                'jumlah_bayar'       => 500000,
                'metode_pembayaran'  => 'transfer',
                'status'             => Payment::STATUS_LUNAS,
                'waktu_pembayaran'   => '2026-07-02 12:00:00',
            ],
            [
                'pemesanan_id'       => $b4->id,
                'jumlah_bayar'       => 675000,
                'metode_pembayaran'  => 'kartu_kredit',
                'status'             => Payment::STATUS_BELUM_LUNAS,
                'waktu_pembayaran'   => null,
            ],
            [
                'pemesanan_id'       => $b5->id,
                'jumlah_bayar'       => 2000000,
                'metode_pembayaran'  => null,
                'status'             => Payment::STATUS_BELUM_LUNAS,
                'waktu_pembayaran'   => null,
            ],
        ];

        foreach ($pembayaran as $data) {
            Payment::create($data);
        }
    }
}
