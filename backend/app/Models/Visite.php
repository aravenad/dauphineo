<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Visite extends Model
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;
    
    protected $table = 'visite';  // Spécifier le nom exact de la table
    public $timestamps = false;    // Désactiver les timestamps si non utilisés

    protected $fillable = [
        'capacite_actuelle',
        'capacite_max',
        'date_visite',
        'id_spr',
        'id_disponibilite'
    ];

    protected $casts = [
        'date_visite' => 'date:Y-m-d',
        'capacite_actuelle' => 'integer',
        'capacite_max' => 'integer',
        'id_spr' => 'integer',
        'id_disponibilite' => 'integer'
    ];

    /**
     * Get the SPR that owns the visit
     */
    public function spr(): BelongsTo
    {
        return $this->belongsTo(Spr::class, 'id_spr', 'id');
    }

    
    /**
     * Get the reservations for the visit
     */
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class, 'id_visite', 'id');
    }


    /**
     * Get the guide availability that created the visit
     */
    public function disponibilite(): BelongsTo
    {
        return $this->belongsTo(Disponibilite::class, 'id_disponibilite');
    }

    /**
     * Get the guide leading the visit
     */
    public function guide(): HasOneThrough
    {
        return $this->hasOneThrough(
            Guide::class,
            Disponibilite::class,
            'id',               // Clé primaire sur disponibilite
            'id',               // Clé primaire sur guide
            'id_disponibilite', // Clé étrangère sur visite
            'id_guide'          // Clé étrangère sur disponibilite
        );
    }
}
