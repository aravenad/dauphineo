<?php

namespace App\Services\Recommandation;

/**
 * Réponses au questionnaire de recommandation, déjà validées par le contrôleur.
 */
final class Preferences
{
    /** Thèmes proposés : chacun est aussi un mot-clé des SPR (colonne mot_cle). */
    public const THEMES = ['antiquite', 'medieval', 'chateau', 'religieux', 'architecture', 'musee', 'nature'];

    /** Cadres proposés : ville, village et montagne sont des mots-clés des SPR, « indifferent » n'en filtre aucun. */
    public const CADRES = ['ville', 'village', 'montagne', 'indifferent'];

    public const DUREES = ['court', 'moyen', 'long'];

    public const LANGUES = ['fr', 'en'];

    /**
     * @param  list<string>  $interets
     */
    public function __construct(
        public readonly int $tailleGroupe,
        public readonly array $interets,
        public readonly string $cadre,
        public readonly string $duree,
        public readonly bool $pmr,
        public readonly string $langue = 'fr',
    ) {}

    /**
     * @param  array{taille_groupe: int, interets: list<string>, cadre: string, duree: string, pmr: bool, langue?: string}  $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            (int) $data['taille_groupe'],
            array_values(array_unique($data['interets'])),
            $data['cadre'],
            $data['duree'],
            (bool) $data['pmr'],
            $data['langue'] ?? 'fr',
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'taille_groupe' => $this->tailleGroupe,
            'interets' => $this->interets,
            'cadre' => $this->cadre,
            'duree' => $this->duree,
            'pmr' => $this->pmr,
        ];
    }
}
