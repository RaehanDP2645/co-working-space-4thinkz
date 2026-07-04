<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            PenggunaSeeder::class,
            RuanganSeeder::class,
            FasilitasSeeder::class,
            PemesananSeeder::class,
            PembayaranSeeder::class,
            RiwayatPemesananSeeder::class,
            RekomendasiRuanganSeeder::class,
        ]);
    }
}
