<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Facility;
use App\Models\Room;

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
            Facility::create(['nama_fasilitas' => $nama]);
        }

        $meetingA = Room::where('nama_ruangan', 'Meeting Room A')->first();
        $meetingB  = Room::where('nama_ruangan', 'Meeting Room B')->first();
        $private   = Room::where('nama_ruangan', 'Private Office')->first();
        $openSpace = Room::where('nama_ruangan', 'Open Space')->first();
        $event     = Room::where('nama_ruangan', 'Event Space')->first();

        $wifi      = Facility::where('nama_fasilitas', 'Wifi')->first();
        $proyektor = Facility::where('nama_fasilitas', 'Proyektor')->first();
        $ac        = Facility::where('nama_fasilitas', 'AC')->first();
        $papan     = Facility::where('nama_fasilitas', 'Papan Tulis')->first();
        $smarttv   = Facility::where('nama_fasilitas', 'Smart TV')->first();
        $sound     = Facility::where('nama_fasilitas', 'Sound System')->first();
        $meja      = Facility::where('nama_fasilitas', 'Meja & Kursi Ergonomis')->first();
        $loker     = Facility::where('nama_fasilitas', 'Loker')->first();

        $meetingA->facilities()->attach([
            $wifi->id,
            $ac->id,
            $proyektor->id,
            $papan->id,
            $smarttv->id,
            $meja->id,
        ]);

        $meetingB->facilities()->attach([
            $wifi->id,
            $ac->id,
            $proyektor->id,
            $papan->id,
            $smarttv->id,
            $sound->id,
            $meja->id,
        ]);

        $private->facilities()->attach([
            $wifi->id,
            $ac->id,
            $meja->id,
            $loker->id,
        ]);

        $openSpace->facilities()->attach([
            $wifi->id,
            $ac->id,
            $meja->id,
        ]);

        $event->facilities()->attach([
            $wifi->id,
            $ac->id,
            $proyektor->id,
            $sound->id,
            $smarttv->id,
        ]);
    }
}
