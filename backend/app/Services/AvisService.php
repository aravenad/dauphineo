<?php

namespace App\Services;

use App\Models\Avis;

class AvisService
{
    /**
     * Part de chaque note (de 1 à 5 étoiles) parmi les avis d'un SPR.
     *
     * @return array<string, float>
     */
    public static function getNotesMoyennes(int $sprId): array
    {
        $parNote = Avis::where('id_spr', $sprId)
            ->selectRaw('note, COUNT(*) as total')
            ->groupBy('note')
            ->pluck('total', 'note');

        $totalAvis = $parNote->sum();

        $repartition = [];
        foreach ([5, 4, 3, 2, 1] as $note) {
            $cle = $note === 1 ? '1_etoile' : "{$note}_etoiles";
            $repartition[$cle] = $totalAvis === 0 ? 0 : round(($parNote[$note] ?? 0) / $totalAvis, 2);
        }

        return $repartition;
    }
}
