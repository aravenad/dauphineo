<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Guide extends Model
{
    use HasFactory;

    protected $table = 'guide';

    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'nom',
        'prenom',
        'mot_de_passe',
        'email',
        'pseudo',
        'verif_age',
        'id_spr',
        'derniere_activite'
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'mot_de_passe',
        'created_at',
        'updated_at'
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'verif_age' => 'boolean',
        'derniere_activite' => 'datetime',
        'mot_de_passe' => 'hashed'
    ];

    /**
     * Get the SPR that the guide belongs to.
     */
    public function spr(): BelongsTo
    {
        return $this->belongsTo(Spr::class, 'id_spr');
    }

    /**
     * Get the disponibilites for the guide.
     */
    public function disponibilites(): HasMany
    {
        return $this->hasMany(Disponibilite::class, 'id_guide');
    }

}
