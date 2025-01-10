<?php

// use App\Models\User;
// use Illuminate\Testing\Fluent\AssertableJson;
// use Illuminate\Support\Str;

// test('list of users', function () {
//     $response = $this->get('/api/users');
//     $response->assertStatus(200);
//     // $response->assertJsonFragment([
//     //     '' => User::first()->name,
//     // ]);
// });

// test('create a new user', function () {
// $user = User::factory()->make();

//     $response = $this->postJson('/api/users', [
//         'name' => $user->name,
//         'email' => $user->email,
//         'password' => 'password123',
//     ]);
//     $response->assertStatus(201);

//     $this->assertDatabaseHas('users', [
//         'email' => $user->email,
//     ]);

//     $response->assertJsonFragment([
//         'name' => $user->name,
//         'email' => $user->email,
//     ]);
// });


// it('update the user if the user exists and data is valid', function () {

//     $user = User::factory()->create();

//     $updatedData = [
//         'name' => 'Updated1 Name',
//         'email' => Str::random(10) . '@example.com',
//         'password' => 'newpassword123',
//     ];

//     $response = $this->putJson("/api/users/{$user->id}", $updatedData);

//     $response->assertStatus(200)
//         ->assertJsonFragment([
//             'name' => $updatedData['name'],
//             'email' => $updatedData['email'],
//         ]);

//     $this->assertDatabaseHas('users', [
//         'id' => $user->id,
//         'name' => $updatedData['name'],
//         'email' => $updatedData['email'],
//     ]);
// });

// it('should delete the user if the user exists', function () {
    
//     $user = User::factory()->create();

//     $response = $this->deleteJson("/api/users/{$user->id}");

//     $response->assertStatus(200)
//         ->assertJson(fn (AssertableJson $json) =>
//             $json->where('message', 'Utilisateur supprimé avec succès')
//         );

//     $this->assertDatabaseMissing('users', [
//         'id' => $user->id
//     ]);
// });