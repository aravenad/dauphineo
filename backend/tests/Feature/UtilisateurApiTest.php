<?php
use App\Models\Utilisateur;
use Illuminate\Http\Request;

/**
 * @test show the authenticated user
 * @group utilisateur
 */
it('returns the authenticated user', function() {

    $user = Utilisateur::factory()->create();
    $response = $this->actingAs($user)->getJson('/api/utilisateur');

    $response->assertStatus(200);
    $response->assertJson([
        'id' => $user->id,
        'nom' => $user->nom,
        'prenom' => $user->prenom,
        'email' => $user->email,
        'pseudo' => $user->pseudo,
    ]);
});

/**
 * @test update the authenticated user
 * @group utilisateur
 */
it("updates the authenticated user", function() {

    $user = Utilisateur::factory()->make();
    $this->actingAs($user);

    $data = [
        'nom' => 'Doe',
        'prenom' => 'John',
        'email' => \Faker\Factory::create()->email,
    ];

    $response = $this->putJson('/api/utilisateur', $data);
    $response->assertStatus(201);
});

/**
 * @test destroy the authenticated user
 * @group utilisateur
 */
it("destroys the authenticated user", function() {

    $user = Utilisateur::factory()->create();
    $this->actingAs($user);

    $response = $this->deleteJson('/api/utilisateur');
    $response->assertStatus(204);
});

/**
 * @test get user's reservation(s)
 * @group utilisateur
 */
it("returns the user's reservation(s)", function() {
    $user = Utilisateur::factory()->make();
    $this->actingAs($user);

    $response = $this->getJson('/api/utilisateur/reservations');
    $response->assertStatus(200);
});

/**
 * @test logout the authenticated user
 * @group utilisateur
 */
it("logs out the authenticated user", function() {
    $user = Utilisateur::factory()->create();
    $this->actingAs($user);

    $response = $this->postJson('/api/utilisateur/logout');
    $response->assertStatus(200);
});