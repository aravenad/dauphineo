<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Creneaux;
use App\Models\Spr;
use App\Models\Visite;
use App\Services\AvisService;
use Carbon\Carbon;

/**
 * @OA\Tag(
 *     name="spr",
 *     description="Endpoints for the Sites Patrimoniaux Remarquables"
 * )
 */
class SprController extends Controller
{
    /** Une ligne complète de cartes sur l'accueil en grand écran. */
    private const TAILLE_CLASSEMENT = 4;

    /**
     * @OA\Get(
     *     path="/api/spr",
     *     tags={"spr"},
     *     summary="List every SPR with its images",
     *     @OA\Response(response=200, description="Success")
     * )
     */
    public function index()
    {
        return Spr::with('images')->orderBy('id')->get();
    }

    /**
     * @OA\Get(
     *     path="/api/spr/{id}",
     *     tags={"spr"},
     *     summary="Get a SPR with its images, reviews, guides and upcoming availabilities",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Success"),
     *     @OA\Response(response=404, description="SPR not found")
     * )
     */
    public function show(string $id)
    {
        $spr = Spr::with([
            'images',
            'guides.disponibilites' => function ($query) {
                $query->where('date_jour', '>=', Carbon::today())->orderBy('date_jour');
            },
            'guides.disponibilites.creneaux',
            'guides.disponibilites.visite',
            'avis' => function ($query) {
                $query->latest();
            },
            'avis.utilisateur:id,pseudo',
        ])->findOrFail($id);

        return response()->json([
            'spr' => $spr,
            'moyenne_notes' => AvisService::getNotesMoyennes($spr->id),
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/spr/{id}/creneaux",
     *     tags={"spr"},
     *     summary="List the daily time slots of a SPR",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Success"),
     *     @OA\Response(response=404, description="SPR not found")
     * )
     */
    public function getCreneauxBySpr(string $id)
    {
        Spr::findOrFail($id);

        return Creneaux::where('id_spr', $id)->orderBy('heure_debut')->get();
    }

    /**
     * @OA\Get(
     *     path="/api/spr/{id}/visites",
     *     tags={"spr"},
     *     summary="List the upcoming visits of a SPR with their slot, guide and remaining places",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Success"),
     *     @OA\Response(response=404, description="SPR not found")
     * )
     */
    public function getVisitesBySpr(string $id)
    {
        Spr::findOrFail($id);

        return Visite::query()
            ->join('disponibilite', 'disponibilite.id', '=', 'visite.id_disponibilite')
            ->join('creneaux', 'creneaux.id', '=', 'disponibilite.id_creneaux')
            ->join('guide', 'guide.id', '=', 'disponibilite.id_guide')
            ->where('visite.id_spr', $id)
            ->where('visite.date_visite', '>=', Carbon::today())
            ->orderBy('visite.date_visite')
            ->orderBy('creneaux.heure_debut')
            ->get([
                'visite.id',
                'visite.date_visite',
                'visite.capacite_actuelle',
                'visite.capacite_max',
                'creneaux.heure_debut',
                'creneaux.heure_fin',
                'guide.id as id_guide',
                'guide.nom as guide_nom',
                'guide.prenom as guide_prenom',
            ]);
    }

    /**
     * @OA\Get(
     *     path="/api/spr/top",
     *     tags={"spr"},
     *     summary="Get the four most booked and the four best rated SPR",
     *     @OA\Response(response=200, description="Success")
     * )
     */
    public function topSpr()
    {
        $mostVisited = Spr::select('spr.id', 'spr.nom_commune', 'spr.code_departement')
            ->join('reservation', 'spr.id', '=', 'reservation.id_spr')
            ->selectRaw('COUNT(reservation.id) as reservations_count')
            ->groupBy('spr.id', 'spr.nom_commune', 'spr.code_departement')
            ->orderByDesc('reservations_count')
            ->orderBy('spr.id')
            ->limit(self::TAILLE_CLASSEMENT)
            ->get();

        $bestRated = Spr::select('spr.id', 'spr.nom_commune', 'spr.code_departement')
            ->join('avis', 'spr.id', '=', 'avis.id_spr')
            ->selectRaw('ROUND(AVG(avis.note), 2) as average_note')
            ->groupBy('spr.id', 'spr.nom_commune', 'spr.code_departement')
            ->orderByDesc('average_note')
            ->orderBy('spr.id')
            ->limit(self::TAILLE_CLASSEMENT)
            ->get();

        return response()->json([
            'most_visited' => $mostVisited,
            'best_rated' => $bestRated,
        ]);
    }
}
