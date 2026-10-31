<?php

use App\Models\Utilisateur;
use Database\Seeders\DatabaseSeeder;
use Laravel\Sanctum\Sanctum;

it('protège l\'espace utilisateur', function () {
    $this->getJson('/api/utilisateur')->assertUnauthorized();
});

it('affiche et modifie son profil', function () {
    Sanctum::actingAs(Utilisateur::where('pseudo', 'demo')->first());

    $this->getJson('/api/utilisateur')->assertOk()->assertJsonPath('pseudo', 'demo')->assertJsonMissingPath('mot_de_passe');
    $this->putJson('/api/utilisateur', ['prenom' => 'Camille'])->assertOk()->assertJsonPath('prenom', 'Camille');
    $this->putJson('/api/utilisateur', ['email' => 'jean.dupont@dauphineo.test'])->assertUnprocessable();
});

it('liste ses réservations, ses visites et ses avis', function () {
    Sanctum::actingAs(Utilisateur::where('pseudo', 'jeandupont')->first());

    $this->getJson('/api/utilisateur/reservations')->assertOk()->assertJsonCount(3);
    $this->getJson('/api/utilisateur/visites')->assertOk()->assertJsonCount(3, 'v_future')->assertJsonCount(0, 'v_passees');
    $this->getJson('/api/utilisateur/avis')->assertOk()->assertJsonStructure(['*' => ['note', 'spr' => ['nom_commune']]]);
});

it('se déconnecte en révoquant le jeton courant', function () {
    $utilisateur = Utilisateur::factory()->create();
    $jeton = $utilisateur->createToken('test')->plainTextToken;

    $this->withToken($jeton)->postJson('/api/utilisateur/logout')->assertOk();
    expect($utilisateur->tokens()->count())->toBe(0);
});

it('supprime son compte', function () {
    $utilisateur = Utilisateur::where('pseudo', 'jeandupont')->first();
    Sanctum::actingAs($utilisateur);

    $this->deleteJson('/api/utilisateur', ['mot_de_passe_actuel' => DatabaseSeeder::motDePasseDemo()])->assertNoContent();
    expect(Utilisateur::find($utilisateur->id))->toBeNull();
});
