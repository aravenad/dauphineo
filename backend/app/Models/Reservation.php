<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $table = 'reservation';

    /**
     * The attributes that are fillable by the user.
     * Ces champs peuvent être modifiés en masse par l'utilisateur.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'date',
        'heure',
        'statut_reservation',
        'statut_paiement',
        'taille',
        'id_utilisateur',
        'id_visite',
        'id_spr',
        'id_guide',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'taille',
    ];

    /**
     * The attributes that are not fillable (guarded).
     * Les champs non mentionnés dans $fillable sont automatiquement protégés.
     *
     * @var array<int, string>
     */
    protected $guarded = [
        'prix', // Par exemple, le prix pourrait être calculé et non modifiable par l'utilisateur.
    ];

    /**
     * Casts for specific attributes.
     * Permet de définir le type des colonnes de la table.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'date',
        'heure' => 'datetime:H:i:s',
        'prix' => 'float',
        'taille' => 'integer',
    ];

    public function guide()
    {
        return $this->belongsTo(Guide::class, 'id_guide');
    }

    public function spr()
    {
        return $this->belongsTo(Spr::class, 'id_spr');
    }

    public function visite()
    {
        return $this->belongsTo(Visite::class, 'id_visite');
    }
}
