<?php

use Illuminate\Http\Request;
use App\Models\Avis;
use App\Models\Utilisateur;
use App\Models\Spr;


/**
 * Test for reviews API
 * @category Test n°2 - Create a new review
 * @param Request $request
 */

it('creates a new review', function () {

    $avisData = Avis::factory()->create()->toArray();

    // Envoyer une requête POST pour créer un nouvel avis
    $response = $this->postJson('/api/avis', $avisData);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'titre',
            'commentaire',
            'note',
            'id_utilisateur',
            'id_spr'
        ]);
});

/**
 * Test for reviews API
 * @category Test n°3 - Get a review by ID
 * @param string $id
 */
it('lists a review by ID', function () {
    $avis = Avis::factory()->create();
    $response = $this->get("/api/avis/{$avis->id}");
    $response->assertStatus(200);
});

/**
 * Test for reviews API
 * @category Test n°4 - Delete a review by SPR
 * @param string $id
 */
it('deletes a review by SPR', function () {

    // Créer un utilisateur
    $utilisateur = Utilisateur::factory()->create();

    // Créer un avis lié à un utilisateur et à un SPR
    $avis = Avis::factory()->create([
        'id_utilisateur' => $utilisateur->id,
        'id_spr' => 1
    ]);

    // Envoyer une requête DELETE pour supprimer un avis
    $response = $this->delete("/api/avis/{$avis->id}");

    // Vérifier que l'avis a été supprimé avec succès
    $response->assertStatus(204);
    $this->assertDatabaseMissing('avis', ['id' => $avis->id]);
});
