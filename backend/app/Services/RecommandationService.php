<?php

namespace App\Services;

use App\Services\Recommandation\ClaudeRecommender;
use App\Services\Recommandation\LocalRecommender;
use App\Services\Recommandation\Preferences;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Recommande jusqu'à six SPR choisis et classés par le moteur local. Si une clé API est configurée,
 * Claude Haiku 5.5 rédige la raison de chacun ; sinon, ou en cas d'échec, la raison reste nulle et
 * le site compose celle du moteur local dans la langue de l'interface.
 */
class RecommandationService
{
    public function __construct(
        private readonly LocalRecommender $local,
        private readonly ?ClaudeRecommender $claude = null,
    ) {}

    /**
     * @return array{source: string, recommandations: list<array{spr: \App\Models\Spr, score: int, raison: ?string, criteres: list<string>}>}
     */
    public function recommander(Preferences $preferences): array
    {
        $candidats = $this->local->candidats($preferences)->load('images');
        $recommandations = $this->local->recommander($preferences, $candidats);
        $raisons = [];

        if ($this->claude !== null && $recommandations !== []) {
            try {
                $raisons = $this->claude->rediger($preferences, $recommandations);
            } catch (Throwable $e) {
                Log::warning('Raisons de Claude indisponibles, repli sur celles du moteur local.', [
                    'erreur' => $e::class,
                    'message' => $e->getMessage(),
                ]);
            }
        }

        return [
            'source' => $raisons === [] ? 'local' : 'claude',
            'recommandations' => array_map(
                fn (array $reco) => [...$reco, 'raison' => $raisons[$reco['spr']->id] ?? null],
                $recommandations,
            ),
        ];
    }
}
