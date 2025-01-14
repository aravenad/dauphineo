<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Spr extends Model
{
    use HasFactory;

     protected $table = 'spr';

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_pmr' => 'boolean',
        'capacite_de_visite' => 'integer',
        'temps_de_visite' => 'integer'
    ];

    /**
     * Get the images associated with the SPR.
     */
    public function images(): HasMany
    {
        return $this->hasMany(Images::class, 'id_spr');
    }

    /**
     * Get the guides associated with the SPR.
     */
    public function guides(): HasMany
    {
        return $this->hasMany(Guide::class, 'id_spr');
    }

    /**
     * Get the reservations for the SPR.
     */
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class, 'id_spr');
    }

    /**
     * Get the visites for the SPR.
     */
    public function visites(): HasMany
    {
        return $this->hasMany(Visite::class, 'id_spr');
    }

    /**
     * Get the avis for the SPR.
     */
    public function avis(): HasMany
    {
        return $this->hasMany(Avis::class, 'id_spr');
    }

    /**
     * Get the creneaux for the SPR.
     */
    public function creneaux()
    {
        return $this->hasMany(Creneaux::class, 'id_spr');
    }

}
