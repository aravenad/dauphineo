<?php

namespace App\Services;

use App\Services\Recommandation\ClaudeRecommender;
use App\Services\Recommandation\LocalRecommender;
use App\Services\Recommandation\Preferences;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Recommande trois SPR : Claude Haiku 5.5 si une clé API est configurée, le moteur local sinon
 * ou en cas d'échec de l'appel.
 */
class RecommandationService
{
    public function __construct(
        private readonly LocalRecommender $local,
        private readonly ?ClaudeRecommender $claude = null,
    ) {}

    /**
     * @return array{source: string, recommandations: list<array{spr: \App\Models\Spr, score: int, raison: string}>}
     */
    public function recommander(Preferences $preferences): array
    {
        $candidats = $this->local->candidats($preferences)->load('images');

        if ($candidats->isEmpty()) {
            return ['source' => 'local', 'recommandations' => []];
        }

        if ($this->claude !== null) {
            try {
                $parId = $candidats->keyBy('id');
                $recommandations = array_map(fn (array $reco) => [
                    'spr' => $parId[$reco['id_spr']],
                    'score' => $this->local->evaluer($preferences, $parId[$reco['id_spr']])['score'],
                    'raison' => $reco['raison'],
                ], $this->claude->recommander($preferences, $candidats));

                return ['source' => 'claude', 'recommandations' => $recommandations];
            } catch (Throwable $e) {
                Log::warning('Recommandation Claude indisponible, repli sur le moteur local.', [
                    'erreur' => $e::class,
                    'message' => $e->getMessage(),
                ]);
            }
        }

        return ['source' => 'local', 'recommandations' => $this->local->recommander($preferences, $candidats)];
    }
}
