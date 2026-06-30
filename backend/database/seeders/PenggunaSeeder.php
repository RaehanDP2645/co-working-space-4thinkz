<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class PenggunaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'nama' => 'Admin 4Thinkz',
            'email' => 'admin@4thinkz.com',
            'password' => 'admin123',
            'no_telepon' => '-',
            'email_verified_at' => now(),
            'peran' => User::ROLE_ADMIN,
        ]);

        $pelanggan = [
            ['nama' => 'Dewi Lestari',   'email' => 'dewi@example.com',  'no_telepon' => '081122334455'],
            ['nama' => 'Reza Rahadian',  'email' => 'reza@example.com',  'no_telepon' => '085566778899'],
            ['nama' => 'Prita Hapsari',  'email' => 'prita@example.com', 'no_telepon' => '081299001122'],
            ['nama' => 'Dimas Anggara',  'email' => 'dimas@example.com', 'no_telepon' => '081344556677'],
        ];

        foreach ($pelanggan as $data) {
            User::create([
                'nama' => $data['nama'],
                'email' => $data['email'],
                'password' => 'password123',
                'no_telepon' => $data['no_telepon'],
                'email_verified_at' => now(),
                'peran' => User::ROLE_USER,
            ]);
        }
    }
}
