<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pemesanan extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'pemesanan';

    public const STATUS_MENUNGGU = 'pending';
    public const STATUS_DIBAYAR = 'paid';
    public const STATUS_DIKONFIRMASI = 'confirmed';
    public const STATUS_SELESAI = 'completed';
    public const STATUS_DIBATALKAN = 'cancelled';

    protected $fillable = [
        'kode_pemesanan',
        'user_id',
        'ruangan_id',
        'waktu_mulai',
        'waktu_selesai',
        'jumlah_orang',
        'status',
        'total_biaya',
        'batas_pembayaran',
    ];

    protected $casts = [
        'waktu_mulai' => 'datetime',
        'waktu_selesai' => 'datetime',
        'total_biaya' => 'decimal:2',
        'batas_pembayaran' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Ruangan::class, 'ruangan_id');
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
