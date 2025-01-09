<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Disponibilite extends Model
{

    use HasFactory;

    protected $table = 'disponibilite';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'date_jour',
        'id_guide',
        'id_creneaux',
    ];

    /**
     * Get the guide that belongs to.
     */
    public function guide()
    {
        return $this->belongsTo(Guide::class, 'id_guide');
    }

    /**
     * Get the creneaux that belongs to.
     */

    public function creneaux(): BelongsTo
    {
        return $this->belongsTo(Creneaux::class, 'id_creneaux');
    }

  

}

