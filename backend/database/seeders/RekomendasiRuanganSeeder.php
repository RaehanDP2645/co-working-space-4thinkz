<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\RekomendasiRuangan;
use App\Models\Ruangan;
use App\Models\User;

class RekomendasiRuanganSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        // mengambil pengguna
        $budi = User::where('email', 'budi@mail.com')->first();
        $ani  = User::where('email', 'ani@mail.com')->first();
        $rudi = User::where('email', 'rudi@mail.com')->first();
        $siti = User::where('email', 'siti@mail.com')->first();
        $dewi = User::where('email', 'dewi@mail.com')->first();



        // mengambil ruangan
        $meetingA = Ruangan::where('nama_ruangan', 'Meeting Room A')->first();
        $meetingB = Ruangan::where('nama_ruangan', 'Meeting Room B')->first();
        $private  = Ruangan::where('nama_ruangan', 'Private Office')->first();
        $open     = Ruangan::where('nama_ruangan', 'Open Space')->first();
        $event    = Ruangan::where('nama_ruangan', 'Event Space')->first();

        $rekomendasi = [


            [
                // User: Budi
                // Input:
                // 8 orang, meeting, budget 200rb, privasi sedang

                'user_id' => $budi->id,

                'ruangan_id' => $meetingA->id,

                'jumlah_peserta' => 8,

                'jenis_aktivitas' => 'meeting',

                'anggaran' => 200000,

                'tingkat_privasi' => 'semi_private',

                'alasan_rekomendasi' =>
                    'Meeting Room A direkomendasikan untuk meeting 8 peserta. Kapasitas 10 orang dengan fasilitas WiFi, AC, proyektor, dan papan tulis yang mendukung aktivitas rapat.',

            ],



            [
                // User: Ani
                // Input:
                // kerja individu

                'user_id' => $ani->id,

                'ruangan_id' => $open->id,

                'jumlah_peserta' => 1,

                'jenis_aktivitas' => 'kerja individu',

                'anggaran' => 250000,

                'tingkat_privasi' => 'publik',

                'alasan_rekomendasi' =>
                    'Open Space cocok untuk pengguna individu yang membutuhkan tempat kerja fleksibel dengan suasana coworking dan biaya lebih terjangkau.',

            ],



            [
                // User: Rudi
                // Presentasi

                'user_id' => $rudi->id,

                'ruangan_id' => $meetingB->id,

                'jumlah_peserta' => 15,

                'jenis_aktivitas' => 'presentasi',

                'anggaran' => 600000,

                'tingkat_privasi' => 'semi_private',

                'alasan_rekomendasi' =>
                    'Meeting Room B direkomendasikan untuk presentasi 15 peserta. Kapasitas 20 orang dengan fasilitas proyektor, Smart TV, dan sound system.',

            ],



            [
                // User: Siti
                // Kerja tim kecil

                'user_id' => $siti->id,

                'ruangan_id' => $private->id,

                'jumlah_peserta' => 3,

                'jenis_aktivitas' => 'kerja tim',

                'anggaran' => 300000,

                'tingkat_privasi' => 'private',

                'alasan_rekomendasi' =>
                    'Private Office cocok untuk tim kecil yang membutuhkan ruang tertutup dengan tingkat privasi tinggi dan fasilitas pendukung kerja.',

            ],



            [
                // Simulasi AI gagal menemukan ruangan

                'user_id' => $dewi->id,

                'ruangan_id' => null,

                'jumlah_peserta' => 200,

                'jenis_aktivitas' => 'event besar',

                'anggaran' => 100000,

                'tingkat_privasi' => 'publik',

                'alasan_rekomendasi' =>
                    'Tidak ditemukan ruangan yang sesuai untuk 200 peserta dengan budget Rp100.000. Silakan ubah jumlah peserta atau anggaran.',

            ],


        ];



        foreach ($rekomendasi as $data) {

            RekomendasiRuangan::create($data);

        }

    }
}