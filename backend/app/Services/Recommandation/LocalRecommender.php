<?php

namespace App\Services\Recommandation;

use App\Models\Spr;
use Illuminate\Support\Collection;

/**
 * Moteur de recommandation sans IA : un score par mots-clés, durée et accessibilité.
 * Le même calcul existe côté frontend (src/demo/recommandation.ts) pour la démo GitHub Pages.
 */
class LocalRecommender
{
    /** Mots-clés des SPR (colonne mot_cle) associés à chaque centre d'intérêt. */
    public const MOTS_CLES_INTERETS = [
        'archeologie' => ['archeologie'],
        'architecture' => ['architecture', 'urbain'],
        'medieval' => ['medieval', 'chateau'],
        'nature' => ['nature'],
        'religion' => ['abbaye'],
        'villages' => ['promenade', 'medieval'],
        'jardins' => ['nature', 'promenade'],
    ];

    /** Mots-clés des SPR associés à chaque type d'expérience. */
    public const MOTS_CLES_EXPERIENCES = [
        'balade' => ['promenade', 'nature'],
        'decouverte' => ['musee', 'architecture'],
        'visite_guidee' => ['chateau', 'abbaye', 'musee'],
        'exploration' => ['archeologie', 'chateau'],
        'immersion' => ['medieval', 'abbaye'],
    ];

    /** Durée idéale en heures pour chaque réponse : [minimum, maximum]. */
    public const DUREES_HEURES = [
        'court' => [0, 2],
        'moyen' => [2, 3],
        'long' => [3, 24],
    ];

    public const LIBELLES = [
        'archeologie' => 'archéologie', 'architecture' => 'architecture', 'medieval' => 'médiéval',
        'nature' => 'nature', 'religion' => 'patrimoine religieux', 'villages' => 'villages',
        'jardins' => 'jardins', 'balade' => 'balade', 'decouverte' => 'découverte',
        'visite_guidee' => 'visite guidée', 'exploration' => 'exploration', 'immersion' => 'immersion',
    ];

    /**
     * SPR compatibles avec les contraintes strictes : accessibilité et taille du groupe.
     *
     * @return Collection<int, Spr>
     */
    public function candidats(Preferences $preferences): Collection
    {
        return Spr::query()
            ->when($preferences->pmr, fn ($query) => $query->where('is_pmr', true))
            ->where('capacite_de_visite', '>=', $preferences->tailleGroupe)
            ->orderBy('id')
            ->get();
    }

    /**
     * @param  Collection<int, Spr>  $candidats
     * @return list<array{spr: Spr, score: int, raison: string}>
     */
    public function recommander(Preferences $preferences, Collection $candidats, int $limite = 3): array
    {
        return $candidats
            ->map(fn (Spr $spr) => ['spr' => $spr, ...$this->evaluer($preferences, $spr)])
            ->sortBy([['score', 'desc'], [fn ($a, $b) => $a['spr']->id <=> $b['spr']->id]])
            ->take($limite)
            ->values()
            ->all();
    }

    /**
     * @return array{score: int, raison: string}
     */
    public function evaluer(Preferences $preferences, Spr $spr): array
    {
        $motsCles = preg_split('/\s+/', trim($spr->mot_cle)) ?: [];
        $points = 0;
        $maximum = 0;
        $retenus = [];

        foreach ([[$preferences->interets, self::MOTS_CLES_INTERETS, 3], [$preferences->experiences, self::MOTS_CLES_EXPERIENCES, 2]] as [$choix, $correspondances, $poids]) {
            foreach ($choix as $cle) {
                $maximum += $poids;
                if (array_intersect($correspondances[$cle] ?? [], $motsCles) !== []) {
                    $points += $poids;
                    $retenus[] = self::LIBELLES[$cle];
                }
            }
        }

        $heures = self::heures($spr->temps_de_visite);
        [$min, $max] = self::DUREES_HEURES[$preferences->duree];
        $ecart = $heures < $min ? $min - $heures : max(0, $heures - $max);
        $maximum += 2;
        $points += max(0, 2 - $ecart);

        $raisons = [];
        if ($retenus !== []) {
            $raisons[] = 'Correspond à vos envies : '.implode(', ', $retenus).'.';
        }
        $raisons[] = 'Visite de '.self::formaterDuree($heures).($ecart == 0 ? ', comme vous le souhaitez.' : '.');
        if ($preferences->pmr) {
            $raisons[] = 'Accessible aux personnes à mobilité réduite.';
        }

        return [
            'score' => (int) round(100 * $points / $maximum),
            'raison' => implode(' ', $raisons),
        ];
    }

    /** Convertit « 02:30:00 » en 2.5. */
    public static function heures(string $temps): float
    {
        [$h, $m] = array_map('intval', explode(':', $temps) + [0, 0]);

        return $h + $m / 60;
    }

    private static function formaterDuree(float $heures): string
    {
        $h = (int) floor($heures);
        $m = (int) round(($heures - $h) * 60);

        return $m === 0 ? "{$h} h" : sprintf('%d h %02d', $h, $m);
    }
}
