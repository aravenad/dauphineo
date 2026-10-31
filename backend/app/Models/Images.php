<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/* Images is a class that represents the Images model
 * It extends the Model class
 * It is used to interact with the images table in the database
 * Here is the structure of the images table:
 * - id (primary key) : bigserial
 * - image_url : varchar(500)
 * - auteur, licence, source : crédit de la photo sur Wikimedia Commons
 * - id_spr : int8 (foreign key)
 * Here are the relationships with other models:
 * - A Spr has many images but an image belongs to only one Spr
 * Here is the ERM of the database:
 * - UTILISATEUR(id,nom,prenom,mot_de_passe,email,pseudo,verif_age,derniere_activite)
 * - RESERVATION(id,date,heure,prix,statut_reservation,statut_paiement,taille,#id_utilisateur,#id_visite,#id_spr,#id_guide)
 * - GUIDE(id,nom,prenom,mot_de_passe,email,pseudo,verif_age,derniere_activite,#id_spr)
 * - DISPONIBILITE(id,date_jour,#id_guide,#id_creneaux)
 * - CRENEAUX(id,heure_debut,heure_fin,#id_spr)
 * - SPR(id,code_departement,nom_du_departement,nom_commune,capacite_de_visite,mot_cle,is_pmr,temps_de_visite)
 * - IMAGES(id,image_url,#id_spr);
 * - VISITE(id,capacite_actuelle,capacite_max,date_visite,#id_spr,#id_disponibilite)
 * - AVIS(id,titre,commentaire,note,date_de_publication,status_avis,#id_utilisateur,#id_spr)
 * The functions in this class are used to interact with the images table through Eloquent ORM and will be used by the ImagesController
 * The ImagesController will call these functions to retrieve, insert, update and delete images from the images table
 */
class Images extends Model
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;

    protected $table = 'images';
    
    protected $fillable = [
        'image_url',
        'auteur',
        'licence',
        'source',
        'id_spr'
    ];
    
    // Explicitly enable timestamps
    public $timestamps = false; //Pause probleme pour la méthode GET /api/images/{id} 
    
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id_spr' => 'integer'
    ];

    

    /**
     * Get the Spr that owns the image.
     */
    public function spr()
    {
        return $this->belongsTo(Spr::class, 'id_spr');
    }
}
