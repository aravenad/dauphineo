<?php

use App\Models\Utilisateur;
use Database\Seeders\DatabaseSeeder;

it('crée un compte et renvoie un jeton', function () {
    $this->postJson('/api/auth/register', [
        'nom' => 'Martin',
        'prenom' => 'Élise',
        'email' => 'elise.martin@dauphineo.test',
        'mot_de_passe' => 'Un-mot-de-passe1',
        'verif_age' => true,
    ])
        ->assertCreated()
        ->assertJsonStructure(['user' => ['id', 'pseudo', 'email'], 'access_token'])
        ->assertJsonMissingPath('user.mot_de_passe');

    expect(Utilisateur::where('email', 'elise.martin@dauphineo.test')->value('pseudo'))
        ->toMatch('/^elise_\d{4}$/');
});

it('refuse une inscription sans majorité ni mot de passe solide', function () {
    $this->postJson('/api/auth/register', [
        'nom' => 'Martin',
        'prenom' => 'Élise',
        'email' => 'demo@dauphineo.test',
        'mot_de_passe' => 'court',
        'verif_age' => false,
    ])->assertUnprocessable()->assertJsonValidationErrors(['email', 'mot_de_passe', 'verif_age']);
});

it('connecte un utilisateur existant', function () {
    $this->postJson('/api/auth/login', [
        'email' => 'demo@dauphineo.test',
        'password' => DatabaseSeeder::motDePasseDemo(),
    ])->assertOk()->assertJsonPath('user.pseudo', 'demo')->assertJsonStructure(['access_token']);
});

it('refuse un mauvais mot de passe', function () {
    $this->postJson('/api/auth/login', [
        'email' => 'demo@dauphineo.test',
        'password' => 'pas-le-bon',
    ])->assertUnauthorized();
});
