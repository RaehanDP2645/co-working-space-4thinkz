<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Room;

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
                'harga'                => 150000,
                'tingkat_privasi'      => 'sedang',
                'mendukung_presentasi' => 1,
                'mendukung_event'      => 0,
                'status'               => Room::STATUS_TERSEDIA,
            ],
            [
                'nama_ruangan'        => 'Meeting Room B',
                'jenis_ruangan'       => 'Meeting Room',
                'kapasitas'           => 20,
                'harga'               => 250000,
                'tingkat_privasi'     => 'sedang',
                'mendukung_presentasi'=> 1,
                'mendukung_event'     => 1,
                'status'              => Room::STATUS_TERSEDIA,
            ],
            [
                'nama_ruangan'        => 'Private Office',
                'jenis_ruangan'       => 'Private Office',
                'kapasitas'           => 4,
                'harga'               => 75000,
                'tingkat_privasi'     => 'tinggi',
                'mendukung_presentasi'=> 0,
                'mendukung_event'     => 0,
                'status'              => Room::STATUS_TERSEDIA,
            ],
            [
                'nama_ruangan'        => 'Open Space',
                'jenis_ruangan'       => 'Hot Desk',
                'kapasitas'           => 30,
                'harga'               => 200000,
                'tingkat_privasi'     => 'rendah',
                'mendukung_presentasi'=> 0,
                'mendukung_event'     => 0,
                'status'              => Room::STATUS_TERSEDIA,
            ],
            [
                'nama_ruangan'        => 'Event Space',
                'jenis_ruangan'       => 'Event Space',
                'kapasitas'           => 100,
                'harga'               => 500000,
                'tingkat_privasi'     => 'rendah',
                'mendukung_presentasi'=> 1,
                'mendukung_event'     => 1,
                'status'              => Room::STATUS_TERSEDIA,
            ],
        ];

        foreach ($ruangan as $data) {
            Room::create($data);
        }
    }
}
