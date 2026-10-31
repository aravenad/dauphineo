<?php

use App\Services\Recommandation\ClaudeRecommender;
use App\Services\Recommandation\LocalRecommender;
use App\Services\Recommandation\Preferences;
use App\Services\RecommandationService;

$preferences = [
    'taille_groupe' => 4,
    'interets' => ['medieval', 'architecture'],
    'cadre' => 'village',
    'duree' => 'moyen',
    'pmr' => true,
];

function avecClaude(ClaudeRecommender $claude): void
{
    app()->instance(RecommandationService::class, new RecommandationService(app(LocalRecommender::class), $claude));
}

it('valide le questionnaire', function () {
    $this->postJson('/api/recommandations', ['taille_groupe' => 0, 'interets' => ['plage'], 'cadre' => 'mer', 'duree' => 'week-end', 'langue' => 'de'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['taille_groupe', 'interets.0', 'cadre', 'duree', 'pmr', 'langue']);
});

it('recommande avec le moteur local sans clé API', function () use ($preferences) {
    $reponse = $this->postJson('/api/recommandations', $preferences)
        ->assertOk()
        ->assertJsonPath('source', 'local')
        ->assertJsonCount(6, 'recommandations')
        ->assertJsonStructure(['recommandations' => [['spr' => ['id', 'nom_commune', 'images'], 'score', 'raison', 'criteres']]])
        ->json('recommandations');

    expect(collect($reponse)->pluck('spr.is_pmr')->unique()->all())->toBe([true]);
    expect(collect($reponse)->pluck('raison')->unique()->all())->toBe([null]);
    expect(collect($reponse)->pluck('score')->all())->toBe(collect($reponse)->pluck('score')->sortDesc()->values()->all());
});

it('donne toujours le même classement pour les mêmes réponses', function () use ($preferences) {
    $premier = $this->postJson('/api/recommandations', $preferences)->json('recommandations.*.spr.id');
    $second = $this->postJson('/api/recommandations', $preferences)->json('recommandations.*.spr.id');

    expect($second)->toBe($premier);
});

it('place en tête un site qui coche tous les thèmes et le cadre', function () {
    $reponse = $this->postJson('/api/recommandations', [
        'taille_groupe' => 2,
        'interets' => ['antiquite', 'musee'],
        'cadre' => 'ville',
        'duree' => 'long',
        'pmr' => false,
    ])->assertOk()->json('recommandations.0');

    expect($reponse['score'])->toBe(100);
    expect($reponse['criteres'])->toBe(['antiquite', 'musee', 'ville']);
    expect($reponse['spr']['mot_cle'])->toContain('antiquite', 'musee', 'ville');
});

it('préfère, à score égal, le site le plus centré sur les thèmes choisis', function () {
    $recommandations = collect($this->postJson('/api/recommandations', [
        'taille_groupe' => 1,
        'interets' => ['nature'],
        'cadre' => 'indifferent',
        'duree' => 'moyen',
        'pmr' => false,
    ])->json('recommandations'));

    $premiers = $recommandations->where('score', $recommandations->first()['score']);
    $themes = $premiers->map(fn ($reco) => count(array_intersect(
        explode(' ', $reco['spr']['mot_cle']),
        ['antiquite', 'medieval', 'chateau', 'religieux', 'architecture', 'musee', 'nature'],
    )));

    expect($themes->values()->all())->toBe($themes->sort()->values()->all());
});

it('fait rédiger les raisons par Claude sans changer le classement', function () use ($preferences) {
    $moteur = app(LocalRecommender::class);
    $local = collect($moteur->recommander(Preferences::fromArray($preferences), $moteur->candidats(Preferences::fromArray($preferences))))
        ->pluck('spr.id')
        ->all();

    $claude = Mockery::mock(ClaudeRecommender::class);
    $claude->shouldReceive('rediger')->once()->andReturn([$local[0] => 'Raison rédigée par Claude.', 9999 => 'Site hors liste.']);
    avecClaude($claude);

    $reponse = $this->postJson('/api/recommandations', [...$preferences, 'langue' => 'en'])
        ->assertOk()
        ->assertJsonPath('source', 'claude')
        ->assertJsonPath('recommandations.0.raison', 'Raison rédigée par Claude.')
        ->assertJsonPath('recommandations.1.raison', null);

    expect($reponse->json('recommandations.*.spr.id'))->toBe($local);
});

it('garde les raisons du moteur local si Claude échoue', function () use ($preferences) {
    $claude = Mockery::mock(ClaudeRecommender::class);
    $claude->shouldReceive('rediger')->once()->andThrow(new RuntimeException('API indisponible'));
    avecClaude($claude);

    $this->postJson('/api/recommandations', $preferences)
        ->assertOk()
        ->assertJsonPath('source', 'local')
        ->assertJsonCount(6, 'recommandations');
});

it('liste les réponses satisfaites par chaque SPR', function () use ($preferences) {
    $criteres = $this->postJson('/api/recommandations', $preferences)
        ->assertOk()
        ->json('recommandations.*.criteres');

    expect($criteres)->each->toBeArray();
    expect(collect($criteres)->flatten()->unique()->diff(['medieval', 'architecture', 'village'])->all())->toBe([]);
    expect(collect($criteres)->flatten())->not->toBeEmpty();
});

it('écarte les SPR trop petits pour le groupe', function () use ($preferences) {
    $capacites = $this->postJson('/api/recommandations', [...$preferences, 'taille_groupe' => 20])
        ->assertOk()
        ->json('recommandations.*.spr.capacite_de_visite');

    expect($capacites)->not->toBeEmpty()->each->toBeGreaterThanOrEqual(20);
});
