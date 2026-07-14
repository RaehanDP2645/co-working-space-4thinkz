<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Ruangan;

class RuanganSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ruangan = [
            [
                'nama_ruangan'         => 'Meeting Room A',
                'jenis_ruangan'        => 'Meeting Room',
                'kapasitas'            => 10,
                'harga_per_jam'        => 150000,
                'tingkat_privasi'      => 'semi_private',
                'mendukung_presentasi' => true,
                'mendukung_event'      => false,
                'deskripsi'            => 'Ruangan meeting kapasitas kecil untuk rapat dan presentasi.',
            ],
            [
                'nama_ruangan'        => 'Meeting Room B',
                'jenis_ruangan'       => 'Meeting Room',
                'kapasitas'           => 20,
                'harga_per_jam'       => 250000,
                'tingkat_privasi'     => 'semi_private',
                'mendukung_presentasi'=> true,
                'mendukung_event'     => true,
                'deskripsi'           => 'Ruangan meeting kapasitas sedang dengan fasilitas presentasi.',
            ],
            [
                'nama_ruangan'        => 'Private Office',
                'jenis_ruangan'       => 'Private Office',
                'kapasitas'           => 4,
                'harga_per_jam'       => 75000,
                'tingkat_privasi'     => 'private',
                'mendukung_presentasi'=> false,
                'mendukung_event'     => false,
                'deskripsi'           => 'Ruang kerja privat untuk kebutuhan individu atau tim kecil.',
            ],
            [
                'nama_ruangan'        => 'Open Space',
                'jenis_ruangan'       => 'Open Space',
                'kapasitas'           => 30,
                'harga_per_jam'       => 200000,
                'tingkat_privasi'     => 'publik',
                'mendukung_presentasi'=> false,
                'mendukung_event'     => false,
                'deskripsi'           => 'Area kerja bersama dengan konsep terbuka.',
            ],
            [
                'nama_ruangan'        => 'Event Space',
                'jenis_ruangan'       => 'Event Space',
                'kapasitas'           => 100,
                'harga_per_jam'       => 500000,
                'tingkat_privasi'     => 'publik',
                'mendukung_presentasi'=> true,
                'mendukung_event'     => true,
                'deskripsi'           => 'Ruangan besar untuk acara, seminar, dan kegiatan komunitas.',
            ],
        ];

        foreach ($ruangan as $data) {
            Ruangan::create($data);
        }
    }
}
