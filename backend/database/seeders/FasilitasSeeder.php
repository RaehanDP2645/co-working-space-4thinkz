<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Fasilitas;
use App\Models\Ruangan;

class FasilitasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $fasilitas = [
            'Wifi',
            'Proyektor',
            'AC',
            'Papan Tulis',
            'Smart TV',
            'Sound System',
            'Meja & Kursi Ergonomis',
            'Loker',
        ];

        foreach ($fasilitas as $nama) {
            Fasilitas::create(['nama_fasilitas' => $nama]);
        }

        $meetingA  = Ruangan::where('nama_ruangan', 'Meeting Room A')->first();
        $meetingB  = Ruangan::where('nama_ruangan', 'Meeting Room B')->first();
        $private   = Ruangan::where('nama_ruangan', 'Private Office')->first();
        $openSpace = Ruangan::where('nama_ruangan', 'Open Space')->first();
        $event     = Ruangan::where('nama_ruangan', 'Event Space')->first();

        $wifi      = Fasilitas::where('nama_fasilitas', 'WiFi')->first();
        $proyektor = Fasilitas::where('nama_fasilitas', 'Proyektor')->first();
        $ac        = Fasilitas::where('nama_fasilitas', 'AC')->first();
        $papan     = Fasilitas::where('nama_fasilitas', 'Papan Tulis')->first();
        $smarttv   = Fasilitas::where('nama_fasilitas', 'Smart TV')->first();
        $sound     = Fasilitas::where('nama_fasilitas', 'Sound System')->first();
        $meja      = Fasilitas::where('nama_fasilitas', 'Meja & Kursi Ergonomis')->first();
        $loker     = Fasilitas::where('nama_fasilitas', 'Loker')->first();

        $meetingA->fasilitas()->attach([
            $wifi->id,
            $ac->id,
            $proyektor->id,
            $papan->id,
            $smarttv->id,
            $meja->id,
        ]);

        $meetingB->fasilitas()->attach([
            $wifi->id,
            $ac->id,
            $proyektor->id,
            $papan->id,
            $smarttv->id,
            $sound->id,
            $meja->id,
        ]);

        $private->fasilitas()->attach([
            $wifi->id,
            $ac->id,
            $meja->id,
            $loker->id,
        ]);

        $openSpace->fasilitas()->attach([
            $wifi->id,
            $ac->id,
            $meja->id,
        ]);

        $event->fasilitas()->attach([
            $wifi->id,
            $ac->id,
            $proyektor->id,
            $sound->id,
            $smarttv->id,
        ]);
    }
}
