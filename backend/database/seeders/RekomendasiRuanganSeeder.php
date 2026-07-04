<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Recommendation;
use App\Models\Room;
use App\Models\User;

class RekomendasiRuanganSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //memanggil pengguna/user dari database pengguna
        $dewi  = User::where('email', 'dewi@example.com')->first();
        $reza  = User::where('email', 'reza@example.com')->first();
        $prita = User::where('email', 'prita@example.com')->first();
        $dimas = User::where('email', 'dimas@example.com')->first();

        //memanggil ruangan dari database ruangan
        $meetingA = Room::where('nama_ruangan', 'Meeting Room A')->first();
        $meetingB = Room::where('nama_ruangan', 'Meeting Room B')->first();
        $private  = Room::where('nama_ruangan', 'Private Office')->first();
        $open     = Room::where('nama_ruangan', 'Open Space')->first();
        $event    = Room::where('nama_ruangan', 'Event Space')->first();

        //contoh isi table rekomendasi ruangan untuk ai
        $rekomendasi = [
            [
                // input user dewi > assistant ai:
                'pengguna_id'        => $dewi->id,
                'ruangan_id'         => $meetingA->id,
                'jumlah_peserta'     => 8,
                'jenis_aktivitas'    => 'meeting',
                'anggaran'           => 200000,
                'kebutuhan_privasi'  => 'sedang',
                'alasan_rekomendasi' => 'Meeting Room A cocok untuk 8 peserta dengan kebutuhan presentasi dan privasi sedang. Kapasitas 10 orang dengan fasilitas proyektor dan smart TV tersedia.',
                // ^ ^ hasil sistem pakar dikirim ke openclaw untuk output rekomendasi ruangan ke user dewi
            ],
            [
                'pengguna_id'        => $reza->id,
                'ruangan_id'         => $open->id,
                'jumlah_peserta'     => 1,
                'jenis_aktivitas'    => 'kerja individu',
                'anggaran'           => 250000,
                'kebutuhan_privasi'  => 'rendah',
                'alasan_rekomendasi' => 'Open Space direkomendasikan untuk kerja individu dengan anggaran fleksibel dan tidak membutuhkan privasi khusus. Suasana coworking yang produktif.',
            ],
            [
                'pengguna_id'        => $prita->id,
                'ruangan_id'         => $meetingB->id,
                'jumlah_peserta'     => 15,
                'jenis_aktivitas'    => 'presentasi',
                'anggaran'           => 600000,
                'kebutuhan_privasi'  => 'sedang',
                'alasan_rekomendasi' => 'Meeting Room B ideal untuk presentasi dengan 15 peserta. Kapasitas 20 orang, dilengkapi sound system dan proyektor untuk presentasi profesional.',
            ],
            [
                'pengguna_id'        => $dimas->id,
                'ruangan_id'         => $private->id,
                'jumlah_peserta'     => 3,
                'jenis_aktivitas'    => 'kerja tim',
                'anggaran'           => 300000,
                'kebutuhan_privasi'  => 'tinggi',
                'alasan_rekomendasi' => 'Private Office direkomendasikan untuk tim kecil 3 orang yang membutuhkan privasi tinggi. Ruangan tertutup dengan fasilitas lengkap dan loker.',
            ],
            [
                //input user dewi > ai assistant yang error
                'pengguna_id'        => $dewi->id,
                'ruangan_id'         => null,
                // ^^ nilai null karena tidak ada ruangan yg cocok dengan input user dewi
                'jumlah_peserta'     => 200,
                'jenis_aktivitas'    => 'konser',
                'anggaran'           => 100000,
                'kebutuhan_privasi'  => 'rendah',
                'alasan_rekomendasi' => 'Tidak ada ruangan yang tersedia untuk 200 peserta dengan anggaran Rp100.000. Silakan sesuaikan jumlah peserta atau anggaran Anda.',
                // ^^ hasil output yang kosong karena tidak menemukan ruangan dengan input user dewi
                // jadi user diminta memasukkan input yang sesuai dengan daftar ruangan yang ada
            ],
        ];

        foreach ($rekomendasi as $data) {
            Recommendation::create($data);
        }
    }
}
