<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    public const ROLE_ADMIN = 'admin';
    public const ROLE_USER = 'customer';

    protected $fillable = [
        'name',
        'email',
        'password',
        'no_telepon',
        'avatar',
        'google_id',
        'role',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function Pemesanan(): HasMany
    {
        return $this->hasMany(Pemesanan::class, 'user_id');
    }

    public function rekomendasi(): HasMany
    {
        return $this->hasMany(RekomendasiRuangan::class, 'user_id');
    }

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function getAvatarUrlAttribute()
    {
        if (! $this->avatar) return null;
        if (str_starts_with($this->avatar, '#')) {
            return $this->avatar;
        }
        if (preg_match('/^https?:\/\//', $this->avatar) || str_starts_with($this->avatar, 'data:')) {
            return $this->avatar;
        }
        return asset('storage/'.$this->avatar);
    }
}
