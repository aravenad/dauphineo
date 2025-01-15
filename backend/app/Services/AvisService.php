<?php
namespace App\Services;

use App\Models\Avis;
class AvisService 
{
    public static function getNotesMoyennes($sprId): array {

        $totalAvis = Avis::where('id_spr', $sprId)->count();

        if ($totalAvis === 0) {
            return [
                '5_etoiles' => 0,
                '4_etoiles' => 0,
                '3_etoiles' => 0,
                '2_etoiles' => 0,
                '1_etoile' => 0,
            ];
        }

        return [
            '5_etoiles' => round(Avis::where('id_spr', $sprId)->where('note', 5)->count() / $totalAvis, 2),
            '4_etoiles' => round(Avis::where('id_spr', $sprId)->where('note', 4)->count() / $totalAvis, 2),
            '3_etoiles' => round(Avis::where('id_spr', $sprId)->where('note', 3)->count() / $totalAvis, 2),
            '2_etoiles' => round(Avis::where('id_spr', $sprId)->where('note', 2)->count() / $totalAvis, 2),
            '1_etoile' => round(Avis::where('id_spr', $sprId)->where('note', 1)->count() / $totalAvis, 2),
        ];
    }
}