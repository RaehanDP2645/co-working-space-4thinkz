<?php

namespace App\Models;

use Database\Seeders\RekomendasiRuanganSeeder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ruangan extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'ruangan';

    protected $fillable = [
        'nama_ruangan',
        'jenis_ruangan',
        'kapasitas',
        'harga_per_jam',
        'gambar',
        'deskripsi',
        'tingkat_privasi',
        'mendukung_presentasi',
        'mendukung_event',
    ];

    protected $casts = [
        'harga_per_jam' => 'decimal:2',
        'mendukung_presentasi' => 'boolean',
        'mendukung_event' => 'boolean',
    ];  

    public function fasilitas(): BelongsToMany
    {
        return $this->belongsToMany(
            Fasilitas::class,
            'fasilitas_ruangan',
            'ruangan_id',
            'fasilitas_id',
        );
    }

    public function pemesanan(): HasMany
    {
        return $this->hasMany(Pemesanan::class, 'ruangan_id');
    }

    public function rekomendasi(): HasMany
    {
        return $this->hasMany(RekomendasiRuangan::class, 'ruangan_id');
    }

    public function getGambarUrlAttribute()
    {
        return $this->gambar
            ? asset('storage/'.$this->gambar)
            : asset('images/default-room.jpg');
    }
}
