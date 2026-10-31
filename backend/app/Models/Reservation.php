<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    /** Prix d'une place, calculé côté serveur. */
    public const PRIX_PAR_PERSONNE = 12.0;

    /** Réservations à venir qu'un compte peut avoir en même temps : le site ne prend pas d'acompte. */
    public const MAX_A_VENIR_PAR_COMPTE = 5;

    protected $table = 'reservation';


    /**
     * The attributes that are fillable by the user.
     * Ces champs peuvent être modifiés en masse par l'utilisateur.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'prix',
        'statut_reservation',
        'statut_paiement',
        'taille',
        'id_utilisateur',
        'id_visite',
        'id_spr',
        'id_guide',
    ];

    /**
     * Casts for specific attributes.
     * Permet de définir le type des colonnes de la table.
     *
     * @var array<string, string>
     */
    protected $casts = [
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

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_utilisateur', 'id');
    }
}
