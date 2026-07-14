<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RekomendasiRuangan extends Model
{
    use HasFactory;

    protected $table = 'rekomendasi_ruangan';

    protected $fillable = [
        'user_id',
        'ruangan_id',
        'jumlah_peserta',
        'jenis_aktivitas',
        'anggaran',
        'kebutuhan_privasi',
        'alasan_rekomendasi',
    ];

    protected $casts = [
        'anggaran' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
