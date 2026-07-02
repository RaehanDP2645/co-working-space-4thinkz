<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class Payment extends Model
{
    use HasFactory;

    protected $table = 'pembayaran';

    public const STATUS_BELUM_LUNAS = 'belum_lunas';
    public const STATUS_LUNAS = 'lunas';
    public const STATUS_GAGAL = 'gagal';

    public $fillable = [
        'pemesanan_id',
        'jumlah_bayar',
        'metode_pembayaran',
        'status',
        'waktu_pembayaran',
    ];

    protected $casts = [
        'jumlah_bayar' => 'decimal:2',
        'waktu pembayaran' => 'datetime',
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class, 'pemesanan_id');
    }
}
