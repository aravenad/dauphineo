<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use App\Models\Spr;
use App\Models\Creneaux;
use App\Services\AvisService;
use App\Http\Controllers\Controller;

/**
 * @OA\Tag(
 *     name="SPR",
 *     description="Endpoints for spr"
 * )
 */
class SprController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/spr",
     *     tags={"SPR"},
     *     summary="Fetch all SPR",
     *     @OA\Response(
     *         response=200,
     *         description="Success"
     *     )
     * )
     */
    public function index()
    {
        return Spr::all();
    }

    /**
     * @OA\Get(
     *     path="/api/spr/{id}",
     *     tags={"SPR"},
     *     summary="Show one SPR",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success"
     *     )
     * )
     */
    public function show(string $id)
    {
        // Pour un seul SPR, on envoie les images du SPR, les creneaux auxquels sont disponibles les guides et les avis du SPR
        $spr = Spr::with([
            'images', 
            'guides.disponibilites' => function ($query) {
                $query->where('date_jour', '>=', Carbon::now())->orderBy('date_jour', 'asc');
            },
            'guides.disponibilites.creneaux', 
            'avis' => function ($query) {
                $query->orderBy('created_at', 'desc');
            },
            'avis.utilisateur:id,pseudo'
            ])->findOrFail($id);
        $repartitionNotes = AvisService::getNotesMoyennes($spr->id);
       
        return response()->json([
            'spr' => $spr,
            'moyenne_notes' => $repartitionNotes
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/spr/{id}/creneaux",
     *     tags={"SPR"},
     *     summary="Retrieve slots a the given SPR",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             minimum=1
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of slots for the specified SPR",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1, description="ID of the creneau"),
     *                 @OA\Property(property="heure_debut", type="string", format="time", example="08:00:00", description="Start time of the creneau"),
     *                 @OA\Property(property="heure_fin", type="string", format="time", example="09:00:00", description="End time of the creneau"),
     *                 @OA\Property(property="id_spr", type="integer", example=1, description="ID of the associated SPR")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="SPR not found",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="error", type="string", example="SPR not found")
     *         )
     *     )
     * )
     */
    public function getCreneauxBySpr($id)
    {
        $creneaux = Creneaux::where('id_spr', $id)->get();

        if ($creneaux->isEmpty()) {
            return response()->json(['error' => 'No creneaux found for the given SPR'], 404);
        }

        return $creneaux;
    }
}