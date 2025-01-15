<?php

use App\Models\Guide;
use App\Models\Visite;
use App\Models\Utilisateur;
use App\Models\Spr;
use App\Models\Reservation;

/**
 * Tests for the Visite API
 * @author nael
 * @category test n°1 - Lister toutes les visites
 */
test('fetch all visites', function () {
    $response = $this->get('/api/visites');
    $response->assertStatus(200);
    // $response->assertJsonFragment([
    //     '' => Visite::first()->name,
    // ]);
});


/**
 * Tests for the Visite API
 * @author nael 
 * @category test n°2 - Create a new visit
 */
test('create a new visite', function () {
    $visite = Visite::factory()->make();

    //Agis comme un setter 
    $response = $this->postJson('/api/visites', [
        'capacite_actuelle' => $visite->capacite_actuelle,
        'capacite_max' => $visite->capacite_max,
        'date_visite' => $visite->date_visite,
        'id_spr' => $visite->id_spr,
        'id_disponibilite' => $visite->id_disponibilite,
    ]);

    $response->assertStatus(201);
});


/**
 * Tests for the Visite API
 * @author nael
 * @category test n°3 - Get a visit by ID
 */
test('get a visite by ID' , function(){

    //We create a visite 
    $visite = Visite::factory()->create();

    //We get the visite by its ID by using the get method from the API
    $response = $this->get("/api/visites/{$visite->id}");

    $response->assertStatus(200)
        ->assertJsonFragment([
            'capacite_actuelle' => $visite->capacite_actuelle,
            'capacite_max' => $visite->capacite_max,
            'date_visite' => $visite->date_visite,
            'id_spr' => $visite->id_spr,
            'id_disponibilite' => $visite->id_disponibilite,
        ]);

});


/**
 * Tests for the Visite API
 * @author nael
 * @category test n°4 - Delete a visite
 */

test('delete a visite' , function(){
    
    //We create a visite 
    $visite = Visite::factory()->create();

    //We delete the visite by its ID by using the delete method from the API
    $response = $this->delete("/api/visites/{$visite->id}");

    $response->assertStatus(200);

    // check if the visit is deleted from the database
    return $this->assertModelMissing($visite);

});

/**
 * Test for the Vsites API
 * @author nael
 * @category test n°5 - Get all visit associated to one user
 */

test('fetching all visit associated to one user' , function(){

    $user = Utilisateur::factory()->create();

    $guide = Guide::where('id', '=' , 38 )->first(); // GuideFactory doesn't exist for the moment 
    $spr = Spr::where('id', '=' , 1 )->first(); //SPRFactory doesn't exist for the moment
    $visite = Visite::factory()->create();
    
    // Création d'une réservation avec le prix explicitement défini
    $reservation = Reservation::create([
        'prix' => 10.50,
        'taille' => 2,
        'id_utilisateur' => $user->id,
        'id_visite' => $visite->id,
        'id_spr' => $spr->id,
        'id_guide' => $guide->id,      
        'statut_reservation' => 'confirmee',
        'statut_paiement' => 'payee',
    ]);
    
    $response = $this->get("/api/visites/utilisateur/{$user->id}"); // Utilisation de l'ID dynamique
    
    $response->assertStatus(200);


 });



/**
* Test for the Visites API
* @author nael
* @category test n°6 - Get all visit associated to one SPR  
*/
test('fetching all visit associated to one SPR' , function(){
    //We create a visite 
    $visite = Visite::factory()->create();

    $response = $this->get("/api/visites/spr/{$visite->id_spr}");

    $response->assertStatus(200);

});