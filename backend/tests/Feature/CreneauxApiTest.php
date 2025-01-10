<?php

test('list of creneaux', function () {
    $rand = rand(1,20);
    $response = $this->get('/api/creneaux/' . $rand);
    $response->assertStatus(200);

    $response->assertJsonStructure([
        '*' => [
            'id',
            'heure_debut',
            'heure_fin',
            'id_spr'
        ]
    ]);

    $response->assertJsonFragment([
        'id_spr' => $rand
    ]);
});
