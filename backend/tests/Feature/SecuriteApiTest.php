<?php

use App\Models\Utilisateur;
use Database\Seeders\DatabaseSeeder;
use Laravel\Sanctum\Sanctum;

it('envoie les en-têtes de sécurité sur les réponses de l\'API', function () {
    $this->getJson('/api/spr')
        ->assertOk()
        ->assertHeader('X-Content-Type-Options', 'nosniff')
        ->assertHeader('X-Frame-Options', 'DENY')
        ->assertHeader('Referrer-Policy', 'no-referrer')
        ->assertHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
});

it('applique les règles de mot de passe et de nom du formulaire', function () {
    $this->postJson('/api/auth/register', [
        'nom' => '<script>alert(1)</script>',
        'prenom' => 'Élise',
        'email' => 'elise.martin@dauphineo.test',
        'mot_de_passe' => 'motdepasse1',
        'verif_age' => true,
    ])->assertUnprocessable()->assertJsonValidationErrors(['nom', 'mot_de_passe']);
});

it('exige le mot de passe actuel pour changer de mot de passe', function () {
    $utilisateur = Utilisateur::where('pseudo', 'demo')->first();
    $courant = $utilisateur->createToken('ici')->plainTextToken;
    $utilisateur->createToken('ailleurs');

    $this->withToken($courant)->putJson('/api/utilisateur', ['mot_de_passe' => 'Nouveau-mdp1'])
        ->assertUnprocessable()->assertJsonValidationErrors('mot_de_passe_actuel');
    $this->withToken($courant)->putJson('/api/utilisateur', ['mot_de_passe' => 'Nouveau-mdp1', 'mot_de_passe_actuel' => 'pas-le-bon'])
        ->assertUnprocessable()->assertJsonValidationErrors('mot_de_passe_actuel');

    $this->withToken($courant)->putJson('/api/utilisateur', [
        'mot_de_passe' => 'Nouveau-mdp1',
        'mot_de_passe_actuel' => DatabaseSeeder::motDePasseDemo(),
    ])->assertOk();

    // Seule la session qui a fait le changement reste ouverte
    expect($utilisateur->tokens()->pluck('name')->all())->toBe(['ici']);
});

it('exige le mot de passe actuel pour changer d\'adresse e-mail, pas pour le nom', function () {
    Sanctum::actingAs(Utilisateur::where('pseudo', 'demo')->first());

    $this->putJson('/api/utilisateur', ['prenom' => 'Camille'])->assertOk();
    $this->putJson('/api/utilisateur', ['email' => 'pirate@exemple.test'])
        ->assertUnprocessable()->assertJsonValidationErrors('mot_de_passe_actuel');
    $this->putJson('/api/utilisateur', ['email' => 'nouvelle@dauphineo.test', 'mot_de_passe_actuel' => DatabaseSeeder::motDePasseDemo()])
        ->assertOk()->assertJsonPath('email', 'nouvelle@dauphineo.test');
});

it('ne supprime pas le compte sans le mot de passe actuel', function () {
    $utilisateur = Utilisateur::where('pseudo', 'demo')->first();
    Sanctum::actingAs($utilisateur);

    $this->deleteJson('/api/utilisateur')->assertUnprocessable();
    $this->deleteJson('/api/utilisateur', ['mot_de_passe_actuel' => 'pas-le-bon'])->assertUnprocessable();
    expect(Utilisateur::find($utilisateur->id))->not->toBeNull();
});

it('limite les écritures d\'un compte à 20 par minute', function () {
    Sanctum::actingAs(Utilisateur::where('pseudo', 'demo')->first());

    for ($i = 0; $i < 20; $i++) {
        $this->deleteJson('/api/avis/999999')->assertNotFound();
    }
    $this->deleteJson('/api/avis/999999')->assertTooManyRequests();
});
