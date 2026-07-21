<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Pemesanan;
use App\Models\Payment;
use App\Models\User;

class PembayaranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $budi = User::where('email', 'budi@mail.com')->first();
        $ani  = User::where('email', 'ani@mail.com')->first();
        $rudi = User::where('email', 'rudi@mail.com')->first();
        $dewi = User::where('email', 'dewi@mail.com')->first();


        $b1 = Pemesanan::where('kode_pemesanan', 'RB-MRB001')->first();
        $b2 = Pemesanan::where('kode_pemesanan', 'RB-ES001')->first();
        $b3 = Pemesanan::where('kode_pemesanan', 'RB-MRB002')->first();
        $b4 = Pemesanan::where('kode_pemesanan', 'RB-PR001')->first();



        $pembayaran = [

            [
                'kode_invoice' => 'INV-MRB001',

                'pemesanan_id' => $b1->id,

                'jumlah_bayar' => 300000,

                'metode_pembayaran' => 'qris',

                'status' => 'paid',

                'waktu_pembayaran' => '2026-06-29 08:30:00',
            ],


            [
                'kode_invoice' => 'INV-ES001',

                'pemesanan_id' => $b2->id,

                'jumlah_bayar' => 500000,

                'metode_pembayaran' => 'qris',

                'status' => 'pending',

                'waktu_pembayaran' => null,
            ],


            [
                'kode_invoice' => 'INV-MRB002',

                'pemesanan_id' => $b3->id,

                'jumlah_bayar' => 250000,

                'metode_pembayaran' => 'qris',

                'status' => 'paid',

                'waktu_pembayaran' => '2026-06-30 09:30:00',
            ],


            [
                'kode_invoice' => 'INV-PR001',

                'pemesanan_id' => $b4->id,

                'jumlah_bayar' => 400000,

                'metode_pembayaran' => 'qris',

                'status' => 'refund',

                'waktu_pembayaran' => '2026-06-27 14:30:00',
            ],

        ];


        foreach ($pembayaran as $data) {

            Payment::create($data);

        }
    }
}