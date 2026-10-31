<?php

use App\Models\Guide;

it('affiche un guide sans son e-mail ni son mot de passe', function () {
    $this->getJson('/api/guides/1')
        ->assertOk()
        ->assertJsonStructure(['id', 'nom', 'prenom', 'spr' => ['id', 'nom_commune']])
        ->assertJsonMissingPath('email')
        ->assertJsonMissingPath('mot_de_passe');
});

it('liste les disponibilités à venir d\'un guide', function () {
    $guide = Guide::first();

    $this->getJson("/api/guides/{$guide->id}/disponibilites")
        ->assertOk()
        ->assertJsonPath('guide.id', $guide->id)
        ->assertJsonStructure(['disponibilites' => [['date_jour', 'creneaux', 'visite']]]);
});

it('ne permet plus de créer ou supprimer un guide par l\'API', function () {
    $this->postJson('/api/guides', [])->assertNotFound();
    $this->deleteJson('/api/guides/1')->assertStatus(405);
});
