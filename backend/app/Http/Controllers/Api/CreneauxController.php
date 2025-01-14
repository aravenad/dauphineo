<?php

namespace App\Http\Controllers\Api;

use App\Models\Creneaux;
use App\Models\Spr;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CreneauxController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/creneaux/{id_spr}",
     *     tags={"Creneaux"},
     *     security={{"bearerAuth": {}}},
     *     summary="Retrieve the créneaux for the given SPR",
     *     @OA\Parameter(
     *         name="id_spr",
     *         in="path",
     *         required=true,
     *         description="The ID of the SPR whose créneaux are to be retrieved",
     *         @OA\Schema(
     *             type="integer",
     *             minimum=1
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of créneaux for the specified SPR",
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
    public function index($id_spr)
    {
        $creneaux = Creneaux::where('id_spr', $id_spr)->get();

        if ($creneaux->isEmpty()) {
            return response()->json(['error' => 'No creneaux found for the given SPR'], 404);
        }

        return response()->json($creneaux, 200);
    }
}
