<?php

use App\Models\Guide;
use Illuminate\Testing\Fluent\AssertableJson;





test('create a new guide with taken email', function () {
    $guideData = [
        'nom' => 'Dupont',
        'prenom' => 'Jean',
        'email' => 'jean.dupont@example.com',
        'pseudo' => 'newpseudo',
        'mot_de_passe' => 'securepassword123',
        'verif_age' => true,
        'derniere_activite' => '2025-01-07T00:00:00Z',
        'id_spr' => 1,
    ];

    $response = $this->postJson('/api/guides', $guideData);
    $response->assertStatus(422);
});



test('create a new guide with taken pseudo', function () {
    $guideData = [
        'nom' => 'Dupont',
        'prenom' => 'Jean',
        'email' => 'new.email@example.com',
        'pseudo' => 'jdupont',
        'mot_de_passe' => 'securepassword123',
        'verif_age' => true,
        'derniere_activite' => '2025-01-07T00:00:00Z',
        'id_spr' => 1,
    ];

    $response = $this->postJson('/api/guides', $guideData);
    $response->assertStatus(422);
});


test('create a new guide successfully', function () {
    $guideData = [
        'nom' => 'Doe',
        'prenom' => 'Jean',
        'email' => 'doe.jean@example.com',
        'pseudo' => 'jdoe',
        'mot_de_passe' => 'securepassword123',
        'verif_age' => true,
        'derniere_activite' => '2025-01-07T00:00:00Z',
        'id_spr' => 1,
    ];

    $response = $this->postJson('/api/guides', $guideData);
    $response->assertStatus(201);

    $this->assertDatabaseHas('guide', [
        'email' => 'doe.jean@example.com',
    ]);

    $response->assertJsonFragment([
        'nom' => 'Doe',
        'prenom' => 'Jean',
        'email' => 'doe.jean@example.com',
        'pseudo' => 'jdoe',
        'id_spr' => 1,
    ]);

});


test('get a specific guide', function () {

    $guide_id = Guide::where('email', 'doe.jean@example.com')->first()->id;

    $response = $this->get("/api/guides/{$guide_id}");
    $response->assertStatus(200);

    $response->assertJsonFragment([
        'nom' => 'Doe',
        'prenom' => 'Jean',
        'email' => 'doe.jean@example.com',
        'pseudo' => 'jdoe',
        'id_spr' => 1,
        ]);
});


test('update a guide', function () {

    $guide_id = Guide::inRandomOrder()->first()->id ?? Guide::factory()->create()->id;

    $uniqString = uniqid();

    $updatedData = [
        'nom' => 'Martin',
        'prenom' => 'Luc',
        'mot_de_passe' => 'guide1234',
        'email' => "luc.martin{$uniqString}@example.com",
        'pseudo' => "lucmartin{$uniqString}",
        'verif_age' => true,
        'derniere_activite' => '2025-01-07T00:00:00Z',
        'id_spr' => 1,
    ];

    $response = $this->putJson("/api/guides/{$guide_id}", $updatedData);
    $response->assertStatus(200);

    $response->assertJsonFragment([
        'nom' => 'Martin',
        'prenom' => 'Luc',
        'email' => $updatedData['email'],
        'pseudo' => $updatedData['pseudo'],
        'id_spr' => 1,
    ]);
});



test('delete a guide', function () {

    $this->assertDatabaseHas('guide', [
        'email' => 'doe.jean@example.com',
    ]);

    $guide_id = Guide::where('email', 'doe.jean@example.com')->first()->id;

    $this->deleteJson("/api/guides/{$guide_id}")->assertStatus(204);

    $this->assertDatabaseMissing('guide', [
        'email' => 'deleted.guide@example.com',
    ]);

});



