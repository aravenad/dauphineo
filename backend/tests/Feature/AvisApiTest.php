<?php

use App\Models\Avis;
use App\Models\Utilisateur;
use Laravel\Sanctum\Sanctum;

it('liste les avis d\'un SPR avec le pseudo de leur auteur', function () {
    $this->getJson('/api/spr/18/avis')
        ->assertOk()
        ->assertJsonStructure(['*' => ['id', 'titre', 'note', 'utilisateur' => ['pseudo']]]);
});

it('exige une connexion pour publier un avis', function () {
    $this->postJson('/api/avis', [])->assertUnauthorized();
});

it('publie un avis puis refuse un doublon', function () {
    Sanctum::actingAs(Utilisateur::factory()->create());
    $avis = ['titre' => 'Superbe', 'commentaire' => 'Guide passionnant.', 'note' => 5, 'id_spr' => 2];

    $this->postJson('/api/avis', $avis)->assertCreated()->assertJsonPath('note', 5);
    $this->postJson('/api/avis', $avis)->assertConflict();
});

it('valide la note', function () {
    Sanctum::actingAs(Utilisateur::factory()->create());

    $this->postJson('/api/avis', ['titre' => 'x', 'commentaire' => 'x', 'note' => 6, 'id_spr' => 2])
        ->assertUnprocessable()->assertJsonValidationErrors('note');
});

it('ne supprime que ses propres avis', function () {
    $avis = Avis::first();

    Sanctum::actingAs(Utilisateur::factory()->create());
    $this->deleteJson("/api/avis/{$avis->id}")->assertForbidden();

    Sanctum::actingAs($avis->utilisateur);
    $this->deleteJson("/api/avis/{$avis->id}")->assertNoContent();
    expect(Avis::find($avis->id))->toBeNull();
});
