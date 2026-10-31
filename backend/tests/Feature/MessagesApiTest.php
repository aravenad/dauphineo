<?php

use App\Notifications\ConfirmationInscription;
use Illuminate\Notifications\AnonymousNotifiable;
use Illuminate\Support\Facades\Route;

it('demande de se connecter en français sur une route protégée', function () {
    $this->getJson('/api/utilisateur')
        ->assertUnauthorized()
        ->assertExactJson(['message' => 'Connectez-vous pour continuer.']);
});

it('répond en français sans nommer le modèle quand une ressource manque', function () {
    $this->getJson('/api/inconnue')
        ->assertNotFound()
        ->assertExactJson(['message' => "Cette ressource n'existe pas."]);

    expect($this->getJson('/api/spr/999999')->assertNotFound()->json('message'))
        ->not->toContain('model')
        ->not->toContain('App\\');
});

it('refuse une méthode non prévue en français', function () {
    $this->deleteJson('/api/spr')
        ->assertMethodNotAllowed()
        ->assertExactJson(['message' => "Cette action n'est pas possible sur cette adresse."]);
});

it('traduit les erreurs de validation et le nom des champs', function () {
    $reponse = $this->postJson('/api/auth/register', ['nom' => 'R2D2', 'email' => 'pas-une-adresse'])
        ->assertUnprocessable();

    expect($reponse->json('errors.mot_de_passe.0'))->toBe('Le champ mot de passe est obligatoire.')
        ->and($reponse->json('errors.prenom.0'))->toBe('Le champ prénom est obligatoire.')
        ->and($reponse->json('errors.email.0'))->toBe('Le champ adresse e-mail doit être une adresse e-mail valide.')
        ->and($reponse->json('errors.nom.0'))->toBe('Le nom ne peut contenir que des lettres, des espaces, des apostrophes et des tirets.')
        ->and($reponse->json('message'))->toEndWith('(et 4 autres erreurs)');
});

it('indique en français combien de temps attendre après trop de demandes', function () {
    foreach (range(1, 10) as $essai) {
        $this->postJson('/api/auth/login', ['email' => 'personne@dauphineo.test', 'password' => 'faux']);
    }

    $reponse = $this->postJson('/api/auth/login', ['email' => 'personne@dauphineo.test', 'password' => 'faux'])
        ->assertTooManyRequests()
        ->assertHeader('Retry-After');

    expect($reponse->json('message'))->toMatch('/^Trop de demandes en peu de temps\. Réessayez dans \d+ secondes\.$/');
});

it('masque le détail d\'une erreur interne hors mode débogage', function () {
    config(['app.debug' => false]);
    Route::get('/api/erreur-de-test', fn () => throw new RuntimeException('détail interne'));

    $this->getJson('/api/erreur-de-test')
        ->assertServerError()
        ->assertExactJson(['message' => 'Une erreur est survenue sur le serveur. Réessayez dans quelques instants.']);
});

it('envoie un e-mail entièrement en français', function () {
    $html = (string) (new ConfirmationInscription('http://localhost:5173/?inscription=abc'))
        ->toMail(new AnonymousNotifiable)
        ->render();

    expect($html)->toContain('Si le bouton « Activer mon compte » ne fonctionne pas')
        ->toContain('Tous droits réservés.')
        ->not->toContain('having trouble')
        ->not->toContain('All rights reserved');
});
