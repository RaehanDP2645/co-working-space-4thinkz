<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]

class User extends Authenticatable
{
    public const ROLE_ADMIN = 'admin';
    public const ROLE_USER = 'user';

    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    protected $table = 'pengguna';

    protected $fillable = [
        'nama',
        'email',
        'password',
        'no_telepon',
        'google_id',
        'peran',
    ];
    
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function bookings():HasMany
    {
        return $this->hasMany(Booking::class, 'pengguna_id');
    }

    public function recommendations(): HasMany
    {
        return $this->hasMany(Recommendation::class, 'pengguna_id');
    }

    public function isAdmin(): bool
    {
        return $this->peran === self::ROLE_ADMIN;
    }
}
