<?php

use App\Models\Utilisateur;
use App\Notifications\CompteExistant;
use App\Notifications\ConfirmationInscription;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Support\Facades\Notification;

const INSCRIPTION = [
    'nom' => 'Martin',
    'prenom' => 'Élise',
    'email' => 'elise.martin@dauphineo.test',
    'mot_de_passe' => 'Un-mot-de-passe1',
    'verif_age' => true,
];

/** Jeton du dernier lien d'activation envoyé à cette adresse */
function jetonEnvoye(string $email): string
{
    $jeton = null;
    Notification::assertSentOnDemand(ConfirmationInscription::class, function ($notification, $canaux, $destinataire) use ($email, &$jeton) {
        parse_str(parse_url($notification->lien, PHP_URL_QUERY), $parametres);
        $jeton = $parametres['inscription'];

        return $destinataire->routes['mail'] === $email;
    });

    return $jeton;
}

beforeEach(fn () => Notification::fake());

it('répond pareil qu\'une adresse ait déjà un compte ou non', function () {
    $nouvelle = $this->postJson('/api/auth/register', INSCRIPTION)->assertAccepted();
    $connue = $this->postJson('/api/auth/register', [...INSCRIPTION, 'email' => 'demo@dauphineo.test'])->assertAccepted();

    expect($connue->json())->toBe($nouvelle->json())
        ->and($nouvelle->json())->not->toHaveKey('access_token');
    expect(Utilisateur::where('email', INSCRIPTION['email'])->exists())->toBeFalse();
    Notification::assertSentOnDemand(ConfirmationInscription::class);
    Notification::assertSentTo(Utilisateur::where('email', 'demo@dauphineo.test')->first(), CompteExistant::class);
});

it('crée le compte à l\'ouverture du lien d\'activation', function () {
    $this->postJson('/api/auth/register', INSCRIPTION)->assertAccepted();
    $jeton = jetonEnvoye(INSCRIPTION['email']);

    $this->postJson('/api/auth/confirmer', ['jeton' => $jeton])
        ->assertCreated()
        ->assertJsonStructure(['user' => ['id', 'pseudo', 'email'], 'access_token'])
        ->assertJsonMissingPath('user.mot_de_passe');

    expect(Utilisateur::where('email', INSCRIPTION['email'])->value('pseudo'))->toMatch('/^elise_\d{4}$/');
    $this->postJson('/api/auth/login', ['email' => INSCRIPTION['email'], 'password' => INSCRIPTION['mot_de_passe']])->assertOk();
    $this->postJson('/api/auth/confirmer', ['jeton' => $jeton])->assertConflict();
});

it('refuse un lien d\'activation modifié ou expiré', function () {
    $this->postJson('/api/auth/confirmer', ['jeton' => 'pas-un-jeton'])->assertUnprocessable();

    $this->postJson('/api/auth/register', INSCRIPTION)->assertAccepted();
    $jeton = jetonEnvoye(INSCRIPTION['email']);
    $this->travel(25)->hours();

    $this->postJson('/api/auth/confirmer', ['jeton' => $jeton])->assertUnprocessable();
    expect(Utilisateur::where('email', INSCRIPTION['email'])->exists())->toBeFalse();
});

it('limite les e-mails envoyés à une même adresse', function () {
    foreach (range(1, 4) as $_) {
        $this->postJson('/api/auth/register', INSCRIPTION)->assertAccepted();
    }

    Notification::assertSentOnDemandTimes(ConfirmationInscription::class, 3);
});

it('refuse une inscription sans majorité ni mot de passe solide', function () {
    $this->postJson('/api/auth/register', [
        'nom' => 'Martin',
        'prenom' => 'Élise',
        'email' => 'pas-une-adresse',
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
