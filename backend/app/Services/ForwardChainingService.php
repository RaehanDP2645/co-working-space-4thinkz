<?php

namespace App\Services;

use App\Models\Ruangan;

class ForwardChainingService
{
    private array $facts = [];
    private array $firedRules = [];
    private array $rules = [];

    public function __construct()
    {
        $this->rules = $this->defineRules();
    }

    private function defineRules(): array
    {
        return [
            // === RULE KAPASITAS ===
            [
                'id' => 'R001',
                'name' => 'Kapasitas Memadai',
                'condition' => fn($f, $r) => $r->kapasitas >= $f['jumlah_peserta'],
                'action' => fn($r) => ['score' => 3, 'reason' => "Kapasitas {$r->kapasitas} orang memadai untuk jumlah peserta"],
            ],
            [
                'id' => 'R002',
                'name' => 'Kapasitas Optimal',
                'condition' => fn($f, $r) => $r->kapasitas >= $f['jumlah_peserta'] * 0.8 && $r->kapasitas <= $f['jumlah_peserta'] * 1.5,
                'action' => fn($r) => ['score' => 2, 'reason' => "Kapasitas {$r->kapasitas} orang tergolong optimal"],
            ],
            [
                'id' => 'R003',
                'name' => 'Kapasitas Terlalu Kecil',
                'condition' => fn($f, $r) => $r->kapasitas < $f['jumlah_peserta'],
                'action' => fn($r) => ['score' => -5, 'reason' => "Kapasitas {$r->kapasitas} orang kurang dari yang dibutuhkan"],
            ],
            [
                'id' => 'R004',
                'name' => 'Kapasitas Terlalu Besar',
                'condition' => fn($f, $r) => $r->kapasitas > $f['jumlah_peserta'] * 5,
                'action' => fn($r) => ['score' => -2, 'reason' => "Kapasitas {$r->kapasitas} orang terlalu besar, tidak efisien"],
            ],

            // === RULE ANGGARAN ===
            [
                'id' => 'R005',
                'name' => 'Sesuai Anggaran',
                'condition' => fn($f, $r) => $r->harga_per_jam <= $f['anggaran'],
                'action' => fn($r) => ['score' => 3, 'reason' => "Harga Rp " . number_format($r->harga_per_jam, 0, ',', '.') . " sesuai anggaran"],
            ],
            [
                'id' => 'R006',
                'name' => 'Hemat Anggaran',
                'condition' => fn($f, $r) => $r->harga_per_jam <= $f['anggaran'] * 0.5,
                'action' => fn($r) => ['score' => 1, 'reason' => 'Harga sangat hemat, tersisa banyak anggaran'],
            ],
            [
                'id' => 'R007',
                'name' => 'Melebihi Anggaran',
                'condition' => fn($f, $r) => $r->harga_per_jam > $f['anggaran'],
                'action' => fn($r) => ['score' => -3, 'reason' => "Harga Rp " . number_format($r->harga_per_jam, 0, ',', '.') . " melebihi anggaran"],
            ],

            // === RULE PRIVASI ===
            [
                'id' => 'R008',
                'name' => 'Privasi Cocok',
                'condition' => fn($f, $r) => $r->tingkat_privasi === $f['tingkat_privasi'],
                'action' => fn($r) => ['score' => 3, 'reason' => "Tingkat privasi '{$r->tingkat_privasi}' sesuai kebutuhan"],
            ],
            [
                'id' => 'R009',
                'name' => 'Privasi Lebih Rendah',
                'condition' => fn($f, $r) => $f['tingkat_privasi'] === 'private' && $r->tingkat_privasi !== 'private',
                'action' => fn($r) => ['score' => -2, 'reason' => "Privasi '{$r->tingkat_privasi}' tidak se-private yang dibutuhkan"],
            ],

            // === RULE AKTIVITAS ===
            [
                'id' => 'R010',
                'name' => 'Jenis Aktivitas Meeting',
                'condition' => fn($f, $r) => $f['jenis_aktivitas'] === 'meeting' && $r->jenis_ruangan === 'Meeting Room',
                'action' => fn($r) => ['score' => 3, 'reason' => 'Jenis ruangan Meeting Room sangat cocok untuk meeting'],
            ],
            [
                'id' => 'R011',
                'name' => 'Jenis Aktivitas Presentasi',
                'condition' => fn($f, $r) => $f['jenis_aktivitas'] === 'presentasi' && $r->mendukung_presentasi,
                'action' => fn($r) => ['score' => 3, 'reason' => 'Ruangan mendukung kegiatan presentasi'],
            ],
            [
                'id' => 'R012',
                'name' => 'Jenis Aktivitas Event',
                'condition' => fn($f, $r) => in_array($f['jenis_aktivitas'], ['event', 'event besar']) && $r->jenis_ruangan === 'Event Space',
                'action' => fn($r) => ['score' => 3, 'reason' => 'Event Space dirancang untuk kegiatan event'],
            ],
            [
                'id' => 'R013',
                'name' => 'Kerja Individu di Private Office',
                'condition' => fn($f, $r) => $f['jenis_aktivitas'] === 'kerja individu' && $r->jenis_ruangan === 'Private Office',
                'action' => fn($r) => ['score' => 4, 'reason' => 'Private Office ideal untuk kerja individu yang fokus'],
            ],
            [
                'id' => 'R014',
                'name' => 'Kerja Tim di Ruangan Besar',
                'condition' => fn($f, $r) => $f['jenis_aktivitas'] === 'kerja tim' && $r->kapasitas >= 10,
                'action' => fn($r) => ['score' => 2, 'reason' => 'Ruangan cukup besar untuk kolaborasi tim'],
            ],
            [
                'id' => 'R015',
                'name' => 'Event Besar di Event Space',
                'condition' => fn($f, $r) => $f['jenis_aktivitas'] === 'event besar' && $r->kapasitas >= 30,
                'action' => fn($r) => ['score' => 3, 'reason' => 'Kapasitas memadai untuk event besar'],
            ],

            // === RULE PRESENTASI & EVENT ===
            [
                'id' => 'R016',
                'name' => 'Mendukung Presentasi',
                'condition' => fn($f, $r) => $f['butuh_presentasi'] && $r->mendukung_presentasi,
                'action' => fn($r) => ['score' => 2, 'reason' => 'Ruangan dilengkapi fasilitas presentasi'],
            ],
            [
                'id' => 'R017',
                'name' => 'Tidak Mendukung Presentasi',
                'condition' => fn($f, $r) => $f['butuh_presentasi'] && !$r->mendukung_presentasi,
                'action' => fn($r) => ['score' => -2, 'reason' => 'Ruangan tidak memiliki fasilitas presentasi'],
            ],
            [
                'id' => 'R018',
                'name' => 'Mendukung Event',
                'condition' => fn($f, $r) => $f['butuh_event'] && $r->mendukung_event,
                'action' => fn($r) => ['score' => 2, 'reason' => 'Ruangan mendukung penyelenggaraan event'],
            ],
            [
                'id' => 'R019',
                'name' => 'Tidak Mendukung Event',
                'condition' => fn($f, $r) => $f['butuh_event'] && !$r->mendukung_event,
                'action' => fn($r) => ['score' => -2, 'reason' => 'Ruangan tidak mendukung event'],
            ],

            // === RULE BONUS FASILITAS ===
            [
                'id' => 'R020',
                'name' => 'Fasilitas Lengkap',
                'condition' => fn($f, $r) => $r->fasilitas()->count() >= 5,
                'action' => fn($r) => ['score' => 1, 'reason' => 'Ruangan memiliki fasilitas lengkap'],
            ],
        ];
    }

    /**
     * Forward Chaining inference engine.
     *
     * 1. Assert facts from user input
     * 2. Load all candidate rooms (knowledge base)
     * 3. For each room, fire all rules, accumulate scores
     * 4. Filter, sort, and return ranked results
     */
    public function recommend(array $input): array
    {
        $this->facts = [
            'jumlah_peserta'   => (int) $input['jumlah_peserta'],
            'jenis_aktivitas'  => $input['jenis_aktivitas'],
            'anggaran'         => (float) $input['anggaran'],
            'tingkat_privasi'  => $input['tingkat_privasi'],
            'butuh_presentasi' => $input['butuh_presentasi'] ?? false,
            'butuh_event'      => $input['butuh_event'] ?? false,
        ];

        $rooms = Ruangan::with('fasilitas')->whereNull('deleted_at')->get();

        $results = [];

        foreach ($rooms as $room) {
            $this->firedRules = [];
            $totalScore = 0;
            $reasons = [];

            foreach ($this->rules as $rule) {
                try {
                    if ($rule['condition']($this->facts, $room)) {
                        $effect = $rule['action']($room);
                        $totalScore += $effect['score'];
                        $reasons[] = $effect['reason'];
                        $this->firedRules[] = $rule['id'];
                    }
                } catch (\Throwable $e) {
                    continue;
                }
            }

            $results[] = [
                'room' => $room,
                'score' => $totalScore,
                'reasons' => $reasons,
                'fired_rules' => $this->firedRules,
            ];
        }

        usort($results, fn($a, $b) => $b['score'] <=> $a['score']);

        $maxScore = $results[0]['score'] ?? 1;
        $minDisplayScore = -2;

        $ranked = [];
        foreach ($results as $r) {
            if ($r['score'] <= $minDisplayScore) {
                continue;
            }
            $normalizedScore = $maxScore > 0 ? round(($r['score'] / $maxScore) * 100, 1) : 0;
            $ranked[] = [
                'room' => $r['room'],
                'skor' => max(0, $normalizedScore),
                'skor_raw' => $r['score'],
                'alasan' => $r['reasons'],
                'rules_fire' => $r['fired_rules'],
                'penjelasan' => $this->generateExplanation($r, $this->facts),
            ];
        }

        return array_slice($ranked, 0, 3);
    }

    /**
     * Generate natural-language explanation (OpenClaw-style AI Assistant)
     * simulating an AI assistant that explains the recommendation reasoning.
     */
    private function generateExplanation(array $result, array $facts): string
    {
        $room = $result['room'];
        $score = $result['score'];
        $reasons = $result['reasons'];

        $lines = [];
        $lines[] = "Berdasarkan analisis sistem pakar menggunakan metode Forward Chaining,";
        $lines[] = "ruangan **{$room->nama_ruangan}** direkomendasikan untuk Anda.";
        $lines[] = "";
        $lines[] = "**Alasan Rekomendasi:**";

        foreach ($reasons as $i => $reason) {
            $lines[] = ($i + 1) . ". {$reason}";
        }

        $lines[] = "";
        $lines[] = "**Detail Ruangan:**";
        $lines[] = "- Jenis: {$room->jenis_ruangan}";
        $lines[] = "- Kapasitas: {$room->kapasitas} orang";
        $lines[] = "- Harga: Rp " . number_format($room->harga_per_jam, 0, ',', '.') . " / jam";
        $lines[] = "- Privasi: {$room->tingkat_privasi}";
        $lines[] = "- Presentasi: " . ($room->mendukung_presentasi ? 'Ya' : 'Tidak');
        $lines[] = "- Event: " . ($room->mendukung_event ? 'Ya' : 'Tidak');

        $facilities = $room->fasilitas->pluck('nama_fasilitas')->implode(', ');
        if ($facilities) {
            $lines[] = "- Fasilitas: {$facilities}";
        }

        if ($score >= 80) {
            $lines[] = "";
            $lines[] = "Rekomendasi ini **sangat cocok** dengan kebutuhan Anda.";
        } elseif ($score >= 50) {
            $lines[] = "";
            $lines[] = "Rekomendasi ini **cukup cocok** dengan kebutuhan Anda.";
        } else {
            $lines[] = "";
            $lines[] = "Rekomendasi ini adalah **pilihan terbaik yang tersedia**, meskipun tidak sepenuhnya sesuai.";
        }

        return implode("\n", $lines);
    }
}
