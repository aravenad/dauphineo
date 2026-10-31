<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Utilisateur extends Authenticatable
{

    use HasApiTokens, HasFactory, Notifiable;
    protected $table = 'utilisateur';

    /** Lettres, avec tirets, apostrophes ou espaces entre deux mots, comme le formulaire du site. */
    public const REGLE_NOM = '/^\p{L}+(?:[-\' ]\p{L}+)*$/u';


    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nom',
        'prenom',
        'mot_de_passe',
        'email',
        'pseudo',
        'verif_age',
        'derniere_activite'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'mot_de_passe',
        'remember_token',
        'created_at',
        'updated_at',
        'derniere_activite',
        'verif_age'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'mot_de_passe' => 'hashed',
        ];
    }

    public function avis(): HasMany
    {
        return $this->hasMany(Avis::class, 'id_utilisateur');
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class, 'id_utilisateur', 'id');
    }

    public function getAuthPassword(): string
    {
        return $this->mot_de_passe;
    }
}
