<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Room extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'ruangan';

    public const STATUS_TERSEDIA = 'tersedia';
    public const STATUS_PERBAIKAN = 'perbaikan';
    public const STATUS_NONAKTIF = 'nonaktif';

    protected $fillable = [
        'nama_ruangan',
        'jenis_ruangan',
        'kapasitas',
        'harga',
        'tingkat_privasi',
        'mendukung_presentasi',
        'mendukung_event',
        'status',
    ];

    protected $casts = [
        'harga' => 'decimal:2',
        'mendukung_presentasi' => 'boolean',
        'mendukung_event' => 'boolean',
    ];  

    public function facilities(): BelongsToMany
    {
        return $this->belongsToMany(
            Facility::class,
            'fasilitas_ruangan',
            'ruangan_id',
            'fasilitas_id',
        );
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'ruangan_id');
    }

    public function recommendations(): HasMany
    {
        return $this->hasMany(Recommendations::class, 'ruangan_id');
    }

    public function isAvailable(): bool
    {
        return $this->status === self::STATUS_TERSEDIA;
    }
}
