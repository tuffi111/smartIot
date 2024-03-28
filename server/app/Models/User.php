<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Notifications\MailResetPasswordNotification;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Spatie\Permission\Traits\HasPermissions;
use Spatie\Permission\Traits\HasRoles;

/**
 * @method static create(array $array)
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasPermissions, HasRoles;

    const PRP_ID = 'id';
    const PRP_NAME = 'name';
    const PRP_EMAIL = 'email';
    const PRP_EMAIL_VERIFIED_AT = 'email_verified_at';
    const PRP_PASSWORD = 'password';
    const PRP_REMEMBER_TOKEN = 'remember_token';
    const PRP_CREATED_AT = 'created_at';
    const PRP_UPDATED_AT = 'updated_at';


    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        self::PRP_NAME,
        self::PRP_EMAIL,
        self::PRP_PASSWORD,
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        self::PRP_PASSWORD,
        self::PRP_REMEMBER_TOKEN,
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        self::PRP_EMAIL_VERIFIED_AT => 'datetime',
        self::PRP_PASSWORD => 'hashed',
    ];


    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new MailResetPasswordNotification($token));
    }
}
