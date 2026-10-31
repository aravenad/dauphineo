<?php

namespace App\Services\Recommandation;

/**
 * Réponses au questionnaire de recommandation, déjà validées par le contrôleur.
 */
final class Preferences
{
    public const INTERETS = ['archeologie', 'architecture', 'medieval', 'nature', 'religion', 'villages', 'jardins'];

    public const EXPERIENCES = ['balade', 'decouverte', 'visite_guidee', 'exploration', 'immersion'];

    public const DUREES = ['court', 'moyen', 'long'];

    /**
     * @param  list<string>  $interets
     * @param  list<string>  $experiences
     */
    public function __construct(
        public readonly int $tailleGroupe,
        public readonly array $interets,
        public readonly string $duree,
        public readonly bool $pmr,
        public readonly array $experiences,
    ) {}

    /**
     * @param  array{taille_groupe: int, interets?: list<string>, duree: string, pmr: bool, experiences?: list<string>}  $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            (int) $data['taille_groupe'],
            array_values(array_unique($data['interets'] ?? [])),
            $data['duree'],
            (bool) $data['pmr'],
            array_values(array_unique($data['experiences'] ?? [])),
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
            'duree' => $this->duree,
            'pmr' => $this->pmr,
            'experiences' => $this->experiences,
        ];
    }
}
