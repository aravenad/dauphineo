<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Creneaux extends Model
{
    // Désactiver les timestamps car les créneaux sont générés en base
    public $timestamps = false;

    protected $table = 'creneaux';

    public function spr()
    {
        return $this->belongsTo(Spr::class, 'id_spr');
    }

    public function disponibilites()
    {
        return $this->hasMany(Disponibilite::class, 'id_creneaux');
    }
}
