<?php

namespace App\Services\Recommandation;

use Anthropic\Client;
use Anthropic\Messages\JSONOutputFormat;
use Anthropic\Messages\OutputConfig;
use App\Models\Spr;
use Illuminate\Support\Collection;
use RuntimeException;

/**
 * Classement des SPR par Claude Haiku 5.5. Toute erreur remonte en exception :
 * RecommandationService se replie alors sur le moteur local.
 */
class ClaudeRecommender
{
    private const SYSTEM = <<<'TXT'
        Tu es le conseiller de Dauphinéo, un site de réservation de visites guidées des Sites Patrimoniaux Remarquables (SPR) d'Isère.
        À partir des réponses d'un visiteur à un questionnaire, choisis les trois SPR qui lui conviennent le mieux parmi la liste fournie, du plus au moins adapté.
        Tous les SPR de la liste respectent déjà ses contraintes d'accessibilité et de taille de groupe.
        Pour chaque SPR, écris une raison d'une ou deux phrases en français, adressée au visiteur (vouvoiement), qui s'appuie sur ses réponses et sur la description du site. N'invente aucune information absente des descriptions.
        TXT;

    private const SCHEMA = [
        'type' => 'object',
        'properties' => [
            'recommandations' => [
                'type' => 'array',
                'items' => [
                    'type' => 'object',
                    'properties' => [
                        'id_spr' => ['type' => 'integer'],
                        'raison' => ['type' => 'string'],
                    ],
                    'required' => ['id_spr', 'raison'],
                    'additionalProperties' => false,
                ],
            ],
        ],
        'required' => ['recommandations'],
        'additionalProperties' => false,
    ];

    public function __construct(
        private readonly Client $client,
        private readonly string $model,
    ) {}

    /**
     * @param  Collection<int, Spr>  $candidats
     * @return list<array{id_spr: int, raison: string}>
     */
    public function recommander(Preferences $preferences, Collection $candidats, int $limite = 3): array
    {
        $sites = $candidats->map(fn (Spr $spr) => [
            'id_spr' => $spr->id,
            'commune' => $spr->nom_commune,
            'mots_cles' => $spr->mot_cle,
            'duree_visite' => substr($spr->temps_de_visite, 0, 5),
            'accessible_pmr' => $spr->is_pmr,
            'description' => $spr->longue_description,
        ])->values()->all();

        $message = $this->client->messages->create(
            model: $this->model,
            maxTokens: 2048,
            system: self::SYSTEM,
            messages: [[
                'role' => 'user',
                'content' => "Réponses du visiteur :\n"
                    .json_encode($preferences->toArray(), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)
                    ."\n\nSPR disponibles :\n"
                    .json_encode($sites, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT),
            ]],
            outputConfig: OutputConfig::with(effort: 'low', format: JSONOutputFormat::with(schema: self::SCHEMA)),
        );

        if ($message->stopReason !== 'end_turn') {
            throw new RuntimeException("Réponse de Claude interrompue ({$message->stopReason}).");
        }

        $texte = '';
        foreach ($message->content as $block) {
            if ($block->type === 'text') {
                $texte .= $block->text;
            }
        }

        $reponse = json_decode($texte, true);
        if (! is_array($reponse['recommandations'] ?? null)) {
            throw new RuntimeException('Réponse de Claude illisible.');
        }

        // Ne garder que des SPR de la liste, sans doublon
        $ids = $candidats->pluck('id')->all();
        $retenues = [];
        foreach ($reponse['recommandations'] as $reco) {
            $id = $reco['id_spr'] ?? null;
            if (in_array($id, $ids, true) && ! isset($retenues[$id]) && trim($reco['raison'] ?? '') !== '') {
                $retenues[$id] = ['id_spr' => $id, 'raison' => trim($reco['raison'])];
            }
        }

        if ($retenues === []) {
            throw new RuntimeException('Claude n\'a recommandé aucun SPR valide.');
        }

        return array_slice(array_values($retenues), 0, $limite);
    }
}
