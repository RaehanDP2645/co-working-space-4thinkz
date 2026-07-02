<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Testing\Fluent\Concerns\Has;

class BookingHistory extends Model
{
    use HasFactory;

    protected $table = 'riwayat_pemesanan';

    protected $fillable = [
        'pemesanan_id',
        'status_sebelumnya',
        'status_sekarang',
        'waktu_perubahan',
    ];

    protected $casts = [
        'waktu_perubahan' => 'datetime',
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class, 'pemesanan_id');
    }
}
