<?php

it('liste les 46 SPR avec leurs images', function () {
    $this->getJson('/api/spr')
        ->assertOk()
        ->assertJsonCount(46)
        ->assertJsonStructure(['*' => ['id', 'nom_commune', 'capacite_de_visite', 'mot_cle', 'is_pmr', 'temps_de_visite', 'courte_description', 'images']]);
});

it('détaille un SPR avec ses guides, ses avis et la répartition des notes', function () {
    $this->getJson('/api/spr/18')
        ->assertOk()
        ->assertJsonPath('spr.id', 18)
        ->assertJsonStructure([
            'spr' => ['images', 'guides' => [['disponibilites' => [['creneaux', 'visite']]]], 'avis'],
            'moyenne_notes' => ['5_etoiles', '1_etoile'],
        ]);
});

it('renvoie 404 pour un SPR inconnu', function () {
    $this->getJson('/api/spr/999')->assertNotFound();
});

it('liste les visites à venir d\'un SPR', function () {
    $visites = $this->getJson('/api/spr/18/visites')
        ->assertOk()
        ->assertJsonStructure(['*' => ['id', 'date_visite', 'capacite_actuelle', 'capacite_max', 'heure_debut', 'heure_fin', 'guide_nom']])
        ->json();

    expect($visites)->not->toBeEmpty();
    // La réservation de démonstration de jeandupont a retiré 4 places à la première visite
    expect($visites[0]['capacite_actuelle'])->toBe($visites[0]['capacite_max'] - 4);
});

it('classe les SPR les plus réservés et les mieux notés', function () {
    $this->getJson('/api/spr/top')
        ->assertOk()
        ->assertJsonPath('most_visited.0.id', 18)
        ->assertJsonCount(3, 'most_visited')
        ->assertJsonPath('best_rated.0.id', 44)
        ->assertJsonCount(3, 'best_rated');
});

it('fournit les descriptions anglaises de chaque SPR', function () {
    $sprs = $this->getJson('/api/spr')->assertOk()->json();

    expect($sprs)->toHaveCount(46)
        ->each(fn ($spr) => $spr->courte_description_en->not->toBeEmpty()
            ->longue_description_en->not->toBeEmpty());
});
