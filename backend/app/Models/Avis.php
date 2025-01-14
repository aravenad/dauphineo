<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Avis extends Model
{
    use HasFactory;

     /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'titre',
        'commentaire',
        'note',
        'id_utilisateur',
        'id_spr',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $visible = [
        'id',
        'titre',
        'commentaire',
        'note',
        'created_at',
        'id_spr',
        'utilisateur'
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'note' => 'integer',
        'date_de_publication' => 'datetime',
        'status_avis' => 'boolean'
    ];

    /**
     * Get the user that owns the review.
     */
    public function utilisateur(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class, 'id_utilisateur');
    }

    /**
     * Get the SPR that owns the review.
     */
    public function spr(): BelongsTo
    {
        return $this->belongsTo(Spr::class, 'id_spr');
    }
}
