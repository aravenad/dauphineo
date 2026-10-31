<?php

namespace App\Services\Recommandation;

use App\Models\Spr;
use Illuminate\Support\Collection;

/**
 * Moteur de recommandation déterministe : les mêmes réponses donnent toujours les mêmes sites, dans le même ordre.
 * Le même calcul existe côté frontend (src/demo/recommandation.ts) pour la démo GitHub Pages.
 */
class LocalRecommender
{
    /** Points par thème choisi que le SPR propose, et pour un cadre qui correspond. */
    private const POIDS_THEME = 3;

    private const POIDS_CADRE = 3;

    /** Points d'une durée dans la plage voulue ; on en perd un par heure d'écart. */
    private const POIDS_DUREE = 2;

    /** Durée idéale en heures pour chaque réponse : [minimum, maximum]. */
    public const DUREES_HEURES = [
        'court' => [0, 2],
        'moyen' => [2, 3],
        'long' => [3, 24],
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
     * Classement par score, puis par part des thèmes du site que le visiteur a choisis (un site centré sur
     * ses envies passe devant un site qui en coche autant parmi beaucoup d'autres), puis par identifiant.
     *
     * @param  Collection<int, Spr>  $candidats
     * @return list<array{spr: Spr, score: int, criteres: list<string>}>
     */
    public function recommander(Preferences $preferences, Collection $candidats, int $limite = 6): array
    {
        return $candidats
            ->map(fn (Spr $spr) => ['spr' => $spr, ...$this->evaluer($preferences, $spr)])
            ->sort(fn ($a, $b) => [$b['score'], $b['focus'], $a['spr']->id] <=> [$a['score'], $a['focus'], $b['spr']->id])
            ->take($limite)
            ->map(fn ($reco) => ['spr' => $reco['spr'], 'score' => $reco['score'], 'criteres' => $reco['criteres']])
            ->values()
            ->all();
    }

    /**
     * Score sur 100, part des thèmes du site choisis par le visiteur, et réponses que le SPR satisfait
     * (clés des thèmes et du cadre).
     *
     * @return array{score: int, focus: float, criteres: list<string>}
     */
    public function evaluer(Preferences $preferences, Spr $spr): array
    {
        $motsCles = preg_split('/\s+/', trim($spr->mot_cle)) ?: [];

        $themes = array_values(array_intersect($preferences->interets, $motsCles));
        $points = self::POIDS_THEME * count($themes);
        $maximum = self::POIDS_THEME * count($preferences->interets);
        $criteres = $themes;

        if ($preferences->cadre !== 'indifferent') {
            $maximum += self::POIDS_CADRE;
            if (in_array($preferences->cadre, $motsCles, true)) {
                $points += self::POIDS_CADRE;
                $criteres[] = $preferences->cadre;
            }
        }

        $maximum += self::POIDS_DUREE;
        $points += max(0, self::POIDS_DUREE - self::ecartDuree($preferences->duree, $spr->temps_de_visite));

        $themesDuSite = count(array_intersect(Preferences::THEMES, $motsCles));

        return [
            'score' => (int) round(100 * $points / $maximum),
            'focus' => $themesDuSite === 0 ? 0.0 : count($themes) / $themesDuSite,
            'criteres' => $criteres,
        ];
    }

    /** Heures entre la durée de visite du SPR et la plage voulue, 0 si elle y est. */
    public static function ecartDuree(string $duree, string $temps): float
    {
        $heures = self::heures($temps);
        [$min, $max] = self::DUREES_HEURES[$duree];

        return $heures < $min ? $min - $heures : max(0, $heures - $max);
    }

    /** Convertit « 02:30:00 » en 2.5. */
    public static function heures(string $temps): float
    {
        [$h, $m] = array_map('intval', explode(':', $temps) + [0, 0]);

        return $h + $m / 60;
    }
}
