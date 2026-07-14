<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        // Admin
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@ruangkita.com',
            'password' => Hash::make('admin123'),
            'no_telepon' => '-',
            'email_verified_at' => now(),
            'role' => 'admin',
            'status' => 'aktif',
        ]);


        $pelanggan = [

            [
                'name' => 'Budi Santoso',
                'email' => 'budi@mail.com',
                'no_telepon' => '081234567890'
            ],

            [
                'name' => 'Ani Wijaya',
                'email' => 'ani@mail.com',
                'no_telepon' => '081298765432'
            ],

            [
                'name' => 'Rudi Hartono',
                'email' => 'rudi@mail.com',
                'no_telepon' => '081344556677'
            ],

            [
                'name' => 'Siti Rahma',
                'email' => 'siti@mail.com',
                'no_telepon' => '081355667788'
            ],

            [
                'name' => 'Dewi Lestari',
                'email' => 'dewi@mail.com',
                'no_telepon' => '081122334455'
            ],

        ];


        foreach ($pelanggan as $data) {

            User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make('password123'),
                'no_telepon' => $data['no_telepon'],
                'email_verified_at' => now(),
                'role' => 'customer',
                'status' => 'aktif',
            ]);

        }
    }
}