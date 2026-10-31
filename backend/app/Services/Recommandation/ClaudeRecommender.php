<?php

namespace App\Services\Recommandation;

use Anthropic\Client;
use Anthropic\Messages\JSONOutputFormat;
use Anthropic\Messages\OutputConfig;
use App\Models\Spr;
use RuntimeException;

/**
 * Raisons rédigées par Claude Haiku 5.5 pour des SPR déjà choisis et classés par le moteur local.
 * Toute erreur remonte en exception : RecommandationService garde alors les raisons du moteur local.
 */
class ClaudeRecommender
{
    private const SYSTEM = <<<'TXT'
        Tu es le conseiller de Dauphinéo, un site de réservation de visites guidées des Sites Patrimoniaux Remarquables (SPR) du Dauphiné : Isère, Drôme et Hautes-Alpes.
        Le moteur de recommandation a déjà choisi et classé des SPR pour un visiteur d'après ses réponses à un questionnaire. Ne change ni la sélection ni l'ordre.
        Pour chaque SPR, écris une raison d'une ou deux phrases adressée au visiteur (vouvoiement en français), qui relie ses réponses à ce que le site propose. Appuie-toi sur les critères satisfaits et sur la description. N'invente aucune information absente des descriptions.
        TXT;

    private const LANGUES = ['fr' => 'français', 'en' => 'anglais'];

    private const SCHEMA = [
        'type' => 'object',
        'properties' => [
            'raisons' => [
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
        'required' => ['raisons'],
        'additionalProperties' => false,
    ];

    public function __construct(
        private readonly Client $client,
        private readonly string $model,
    ) {}

    /**
     * @param  list<array{spr: Spr, score: int, criteres: list<string>}>  $recommandations
     * @return array<int, string> raison par identifiant de SPR
     */
    public function rediger(Preferences $preferences, array $recommandations): array
    {
        $sites = array_map(fn (array $reco) => [
            'id_spr' => $reco['spr']->id,
            'commune' => $reco['spr']->nom_commune,
            'departement' => $reco['spr']->nom_du_departement,
            'mots_cles' => $reco['spr']->mot_cle,
            'duree_visite' => substr($reco['spr']->temps_de_visite, 0, 5),
            'accessible_pmr' => $reco['spr']->is_pmr,
            'criteres_satisfaits' => $reco['criteres'],
            // La description dans la langue des raisons évite au modèle de traduire en rédigeant
            'description' => $preferences->langue === 'en'
                ? ($reco['spr']->longue_description_en ?? $reco['spr']->longue_description)
                : $reco['spr']->longue_description,
        ], $recommandations);

        $message = $this->client->messages->create(
            model: $this->model,
            maxTokens: 2048,
            system: self::SYSTEM,
            messages: [[
                'role' => 'user',
                'content' => "Réponses du visiteur :\n"
                    .json_encode($preferences->toArray(), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)
                    ."\n\nSPR retenus, du plus au moins adapté :\n"
                    .json_encode($sites, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)
                    ."\n\nRédige les raisons en ".self::LANGUES[$preferences->langue].'.',
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
        if (! is_array($reponse['raisons'] ?? null)) {
            throw new RuntimeException('Réponse de Claude illisible.');
        }

        // Ne garder que les SPR demandés, une raison chacun
        $ids = array_map(fn (array $reco) => $reco['spr']->id, $recommandations);
        $raisons = [];
        foreach ($reponse['raisons'] as $reco) {
            $id = $reco['id_spr'] ?? null;
            if (in_array($id, $ids, true) && ! isset($raisons[$id]) && trim($reco['raison'] ?? '') !== '') {
                $raisons[$id] = trim($reco['raison']);
            }
        }

        if ($raisons === []) {
            throw new RuntimeException('Claude n\'a rédigé aucune raison valide.');
        }

        return $raisons;
    }
}
