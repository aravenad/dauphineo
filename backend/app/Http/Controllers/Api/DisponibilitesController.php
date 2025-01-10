<?php
namespace App\Http\Controllers\Api;

use App\Models\Disponibilite;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;



/**
 * @OA\Tag(
 *     name="Disponibilities",
 *     description="Endpoints for disponibility management"
 * )
 */

class DisponibilitesController extends Controller
{

    /**
     * @OA\Get(
     *     path="/api/disponibilites/{id_guide}/{id_spr}",
     *     tags={"Disponibilities"},
     *     operationId="getDisponibilitesByGuideAndSPR",
     *     summary="Get disponibilites filtered by guide and SPR",
     *     description="Retrieve disponibilites for a specific guide and SPR based on their IDs.",
     *     @OA\Parameter(
     *         name="id_guide",
     *         in="path",
     *         required=true,
     *         description="The ID of the guide",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Parameter(
     *         name="id_spr",
     *         in="path",
     *         required=true,
     *         description="The ID of the SPR",
     *         @OA\Schema(type="integer", example=2)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of filtered disponibilites",
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
     *         description="No disponibilites found",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="No disponibilites found for the given guide and SPR")
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
            return response()->json(['message' => 'No disponibilites found for the given guide and SPR'], 404);
        }

        return response()->json($disponibilites, 200);
    }



      /**
     * @OA\Delete(
     *     path="/api/disponibilites/{id}",
     *     tags={"Disponibilities"},
     *     security={{"bearerAuth": {}}},
     *     summary="Delete disponibility",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="Disponiility deleted successfully"
     *     )
     * )
     */
    public function destroy(string $id)
    {
        $dispo = Disponibilite::findOrFail($id);
        $dispo->delete();
        return response()->json(null, 204);
    }




    /**
     * @OA\Post(
     *     path="/api/disponibilites/{date_jour}/{id_guide}/{id_creneaux}",
     *     tags={"Disponibilities"},
     *     summary="Create a new disponibilite",
     *     description="Endpoint to create a new disponibilite with explicit parameters",
     *     operationId="createDisponibiliteWithParams",
     *     @OA\Parameter(
     *         name="date_jour",
     *         in="path",
     *         required=true,
     *         description="The date for the disponibilite",
     *         @OA\Schema(type="string", format="date", example="2025-01-10")
     *     ),
     *     @OA\Parameter(
     *         name="id_guide",
     *         in="path",
     *         required=true,
     *         description="The ID of the guide",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Parameter(
     *         name="id_creneaux",
     *         in="path",
     *         required=true,
     *         description="The ID of the creneaux",
     *         @OA\Schema(type="integer", example=3)
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Disponibilite created successfully",
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
    public function store($date_jour, $id_guide, $id_creneaux)
    {
        $validatedData = [
            'date_jour' => $date_jour,
            'id_guide' => $id_guide,
            'id_creneaux' => $id_creneaux,
        ];

        $validator = \Validator::make($validatedData, [
            'date_jour' => 'required|date',
            'id_guide' => 'required|exists:guide,id',
            'id_creneaux' => 'required|exists:creneaux,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 400);
        }

        $disponibilite = Disponibilite::create($validatedData);

        return response()->json($disponibilite, 201);
    }
}
