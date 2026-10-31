<?php

use App\Models\Reservation;
use App\Models\Utilisateur;
use App\Models\Visite;
use Laravel\Sanctum\Sanctum;

function visiteLibre(): Visite
{
    return Visite::where('id_spr', 2)->orderBy('date_visite')->orderBy('id')->firstOrFail();
}

it('exige une connexion pour réserver', function () {
    $this->postJson('/api/reservations', [])->assertUnauthorized();
});

it('réserve une visite au prix fixé par le serveur et décompte les places', function () {
    Sanctum::actingAs(Utilisateur::factory()->create());
    $visite = visiteLibre();

    $this->postJson('/api/reservations', ['id_visite' => $visite->id, 'taille' => 3, 'prix' => 0])
        ->assertCreated()
        ->assertJsonPath('taille', 3)
        ->assertJsonPath('id_spr', 2)
        ->assertJsonPath('visite.capacite_actuelle', $visite->capacite_max - 3);

    expect((float) Reservation::latest('id')->value('prix'))->toBe(3 * Reservation::PRIX_PAR_PERSONNE);
});

it('refuse une réservation au-delà des places restantes', function () {
    Sanctum::actingAs(Utilisateur::factory()->create());
    $visite = visiteLibre();

    $this->postJson('/api/reservations', ['id_visite' => $visite->id, 'taille' => $visite->capacite_actuelle + 1])
        ->assertConflict();
    expect($visite->fresh()->capacite_actuelle)->toBe($visite->capacite_actuelle);
});

it('annule sa réservation et libère les places', function () {
    $utilisateur = Utilisateur::factory()->create();
    Sanctum::actingAs($utilisateur);
    $visite = visiteLibre();
    $id = $this->postJson('/api/reservations', ['id_visite' => $visite->id, 'taille' => 2])->json('id');

    Sanctum::actingAs(Utilisateur::factory()->create());
    $this->deleteJson("/api/reservations/{$id}")->assertForbidden();

    Sanctum::actingAs($utilisateur);
    $this->deleteJson("/api/reservations/{$id}")->assertNoContent();
    expect(Reservation::find($id))->toBeNull()
        ->and($visite->fresh()->capacite_actuelle)->toBe($visite->capacite_max);
});
