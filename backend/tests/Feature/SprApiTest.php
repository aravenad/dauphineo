<?php

/** 
 * Test for SPR API
 * @category Test n°1 - Fetch all spr
 */

it('ensures fetching all SPR', function () {
    $response = $this->get('/api/spr');
    $response->assertStatus(200)
    ->assertJsonStructure([
        '*' => [
            'id',
            'code_departement',
            'nom_du_departement',
            'nom_commune',
            'capacite_de_visite',
            'mot_cle',
            'is_pmr',
            'temps_de_visite'
        ]
    ]);
});


/**
 * Test for SPR API
 * @category Test n°2 - Show one SPR
 * @param integer $id
 */

it('shows one SPR', function() {
    $response = $this->get('/api/spr/1');
    $response->assertStatus(200);
});

/**
 * Test for SPR API
 * @category Test n°3 - Get slots by SPR
 * @param integer $id
 */
it('lists all slots for a given spr', function () {
    $rand = rand(1,20);
    $response = $this->get("/api/spr/$rand/creneaux");
    $response->assertStatus(200);

    $response->assertJsonStructure([
        '*' => [
            'id',
            'heure_debut',
            'heure_fin',
            'id_spr'
        ]
    ]);
});
