<?php
namespace App\Http\Controllers\Api;

use App\Models\Disponibilite;
use App\Models\Creneaux;
use App\Models\Spr;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;


/**
 * @OA\Tag(
 *     name="disponibilites",
 *     description="Endpoints for availabilities management"
 * )
 */

class DisponibilitesController extends Controller
{

    /**
     * @OA\Get(
     *     path="/api/disponibilites/{id_guide}/{id_spr}",
     *     tags={"disponibilites"},
     *     security={{"bearerAuth": {}}},
     *     summary="Get availabilities filtered by guide and SPR",
     *     @OA\Parameter(
     *         name="id_guide",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Parameter(
     *         name="id_spr",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer", example=2)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of filtered availabilities",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="date_jour", type="string", format="date", example="2025-01-09"),
     *                 @OA\Property(property="id_guide", type="integer", example=3),
     *                 @OA\Property(property="id_creneaux", type="integer", example=5)
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No availability found",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="No availability found for the given guide and SPR")
     *         )
     *     )
     * )
     */
    public function index($id_guide, $id_spr)
    {
        $disponibilites = Disponibilite::where('id_guide', $id_guide)
            ->whereHas('creneaux', function ($query) use ($id_spr) {
                $query->where('id_spr', $id_spr);
            })
            ->get();

        if ($disponibilites->isEmpty()) {
            return response()->json(['message' => 'No availabilities found for the given guide and SPR'], 404);
        }

        return $disponibilites;
    }

    /**
     * @OA\Post(
     *     path="/api/disponibilites",
     *     tags={"disponibilites"},
     *     security={{"bearerAuth": {}}},
     *     summary="Create a new availability",
     *     @OA\Response(
     *         response=201,
     *         description="Availability created successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="date_jour", type="string", format="date", example="2025-01-10"),
     *             @OA\Property(property="id_guide", type="integer", example=1),
     *             @OA\Property(property="id_creneaux", type="integer", example=3)
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid data provided",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Validation failed")
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        // On cherche si un créneau existe
        $creneau = Creneaux::findOrFail($request->id_creneaux);
 
        // On vérifie que le créneau appartient bien au SPR
        Spr::findOrFail($creneau->id_spr);

        $data = $request->validate([
            'date_jour' => 'required|date',
            'id_guide' => 'required|exists:guide,id',
            'id_creneaux' => 'required|exists:creneaux,id',
        ]);

        $disponibilites = Disponibilite::create($data);

        return response()->json($disponibilites, 201);
    }

    
    /**
     * @OA\Delete(
     *     path="/api/disponibilites/{id}",
     *     tags={"disponibilites"},
     *     security={{"bearerAuth": {}}},
     *     summary="Delete one availability",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="Availability deleted successfully"
     *     )
     * )
     */
    public function destroy(string $id)
    {
        $dispo = Disponibilite::findOrFail($id);
        $dispo->delete();
        return response()->json(null, 204);
    }
}
