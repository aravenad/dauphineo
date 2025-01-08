<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Visite extends Model
{
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
        'date_visite' => 'date',
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

    
    public function guide()
    {
        return $this->hasOneThrough(
            Guide::class,
            Reservation::class,
            'id_visite', // Clé étrangère sur reservation
            'id',        // Clé primaire sur guide
            'id',        // Clé primaire sur visite
            'id_guide'   // Clé étrangère sur reservation
        );
    }
}
