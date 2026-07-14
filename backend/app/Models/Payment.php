<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $table = 'pembayaran';

    public const STATUS_BELUM_LUNAS = 'belum_lunas';
    public const STATUS_PAID = 'paid';
    public const STATUS_GAGAL = 'failed';
    public const STATUS_REFUND = 'refund';

    public $fillable = [
        'kode_invoice',
        'pemesanan_id',
        'jumlah_bayar',
        'metode_pembayaran',
        'status',
        'waktu_pembayaran',
    ];

    protected $casts = [
        'jumlah_bayar' => 'decimal:2',
        'waktu_pembayaran' => 'datetime',
    ];

    public function Pemesanan(): BelongsTo
    {
        return $this->belongsTo(Pemesanan::class, 'pemesanan_id');
    }
}
