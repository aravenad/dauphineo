<?php

use App\Services\Recommandation\ClaudeRecommender;
use App\Services\Recommandation\LocalRecommender;
use App\Services\RecommandationService;

$preferences = [
    'taille_groupe' => 4,
    'interets' => ['medieval', 'architecture'],
    'duree' => 'moyen',
    'pmr' => true,
    'experiences' => ['exploration'],
];

function avecClaude(ClaudeRecommender $claude): void
{
    app()->instance(RecommandationService::class, new RecommandationService(app(LocalRecommender::class), $claude));
}

it('valide le questionnaire', function () {
    $this->postJson('/api/recommandations', ['taille_groupe' => 0, 'interets' => ['plage'], 'duree' => 'week-end'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['taille_groupe', 'interets.0', 'duree', 'pmr', 'experiences']);
});

it('recommande avec le moteur local sans clé API', function () use ($preferences) {
    $reponse = $this->postJson('/api/recommandations', $preferences)
        ->assertOk()
        ->assertJsonPath('source', 'local')
        ->assertJsonCount(6, 'recommandations')
        ->assertJsonStructure(['recommandations' => [['spr' => ['id', 'nom_commune', 'images'], 'score', 'raison', 'criteres']]])
        ->json('recommandations');

    expect(collect($reponse)->pluck('spr.is_pmr')->unique()->all())->toBe([true]);
    expect(collect($reponse)->pluck('score')->all())->toBe(collect($reponse)->pluck('score')->sortDesc()->values()->all());
});

it('utilise les raisons de Claude quand l\'appel réussit', function () use ($preferences) {
    $claude = Mockery::mock(ClaudeRecommender::class);
    $claude->shouldReceive('recommander')->once()->andReturn([
        ['id_spr' => 18, 'raison' => 'Raison rédigée par Claude.'],
    ]);
    avecClaude($claude);

    $this->postJson('/api/recommandations', $preferences)
        ->assertOk()
        ->assertJsonPath('source', 'claude')
        ->assertJsonPath('recommandations.0.spr.id', 18)
        ->assertJsonPath('recommandations.0.raison', 'Raison rédigée par Claude.')
        ->assertJsonStructure(['recommandations' => [['criteres']]]);
});

it('se replie sur le moteur local si Claude échoue', function () use ($preferences) {
    $claude = Mockery::mock(ClaudeRecommender::class);
    $claude->shouldReceive('recommander')->once()->andThrow(new RuntimeException('API indisponible'));
    avecClaude($claude);

    $this->postJson('/api/recommandations', $preferences)
        ->assertOk()
        ->assertJsonPath('source', 'local')
        ->assertJsonCount(6, 'recommandations');
});

it('refuse le type d\'expérience « visite guidée », proposé par tous les SPR', function () use ($preferences) {
    $this->postJson('/api/recommandations', [...$preferences, 'experiences' => ['visite_guidee']])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['experiences.0']);
});

it('liste les réponses satisfaites par chaque SPR', function () use ($preferences) {
    $criteres = $this->postJson('/api/recommandations', $preferences)
        ->assertOk()
        ->json('recommandations.*.criteres');

    expect($criteres)->each->toBeArray();
    expect(collect($criteres)->flatten()->unique()->diff(['médiéval', 'architecture', 'exploration'])->all())->toBe([]);
    expect(collect($criteres)->flatten())->not->toBeEmpty();
});

it('écarte les SPR trop petits pour le groupe', function () use ($preferences) {
    $capacites = $this->postJson('/api/recommandations', [...$preferences, 'taille_groupe' => 20])
        ->assertOk()
        ->json('recommandations.*.spr.capacite_de_visite');

    expect($capacites)->not->toBeEmpty()->each->toBeGreaterThanOrEqual(20);
});
