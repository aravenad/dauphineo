<?php
namespace App\Http\Controllers\Api;

use App\Models\Disponibilite;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;


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
     *     path="/api/disponibilites",
     *     tags={"Disponibilities"},
     *     security={{"bearerAuth": {}}},
     *     summary="Get all disponibilities",
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example="1"),
     *                 @OA\Property(property="date_jour", type="string", format="date",example="2025-01-07"),
     *                 @OA\Property(property="id_guide", type="integer", example="1"),
     *                 @OA\Property(property="id_crenenaux", type="integer", example="1"),
     *             )
     *         )
     *     )
     * )
     */

    public function index()
    {
        try {
            $dispo = Disponibilite::with(['visite', 'creneaux','guide'])->get();
            return response()->json($dispo, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Une erreur est survenue lors de la récupération des diponibiltés',
                'error' => $e->getMessage()
            ], 500);
        }
        
    }


    /**
     * @OA\Get(
     *     path="/api/disponibilites/{id}",
     *     tags={"Disponibilities"},
     *     security={{"bearerAuth": {}}},
     *     summary="Get specific disponibility",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Disponibility details"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="disponibility not found"
     *     )
     * )
     */
    public function show(string $id)
    {
        $dispo = Disponibilite::with(['visite', 'creneaux', 'guide'])->findOrFail($id);
        return response()->json($dispo);
    }

   


    /**
     * @OA\Put(
     *     path="/api/disponibilites/{id}",
     *     tags={"Disponibilities"},
     *     security={{"bearerAuth": {}}},
     *     summary="Update disponibility",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *                 @OA\Property(property="id", type="integer", example="1"),
     *                 @OA\Property(property="date_jour", type="string", format="date",example="2025-01-07"),
     *                 @OA\Property(property="id_guide", type="integer", example="1"),
     *                 @OA\Property(property="id_crenenaux", type="integer", example="1")
     *           )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="disponiility updated successfully"
     *     )
     * )
     */
    public function update(Request $request, string $id)
    {
        $dispo = Disponibilite::findOrFail($id);
        
        $validated = $request->validate([
            'date_jour' => 'date',
            'id_guide' => 'exists:spr,id',
            'id_creneaux' => 'exists:creneaux,id'
        ]);

        $dispo->update($validated);
        return response()->json($dispo);
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
}
