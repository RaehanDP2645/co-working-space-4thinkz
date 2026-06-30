<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'pemesanan';

    public const STATUS_MENUNGGU = 'menunggu';
    public const STATUS_DIKONFIRMASI = 'dikonfirmasi';
    public const STATUS_SELESAI = 'selesai';
    public const STATUS_DIBATALKAN = 'dibatalkan';

    protected $fillable = [
        'pengguna_id',
        'ruangan_id',
        'waktu_mulai',
        'waktu_selesai',
        'status',
        'total_biaya',
    ];

    protected $casts = [
        'waktu_mulai' => 'datetime',
        'waktu_selesai' => 'datetime',
        'total_biaya' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'pengguna_id');
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class, 'ruangan_id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'pemesanan_id');
    }

    public function histories(): HasMany
    {
        return $this->hasMany(BookingHistory::class, 'pemesanan_id');
    }
}
