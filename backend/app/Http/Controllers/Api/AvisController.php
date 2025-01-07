<?php

namespace App\Http\Controllers\Api;

use App\Models\Avis;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

/**
 * @OA\Tag(
 *     name="Avis",
 *     description="API Endpoints for managing reviews"
 * )
 */
class AvisController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/avis",
     *     tags={"Avis"},
     *     security={{"bearerAuth": {}}},
     *     summary="Get all reviews",
     *     @OA\Response(
     *         response=200,
     *         description="List of reviews",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="titre", type="string"),
     *                 @OA\Property(property="commentaire", type="string"),
     *                 @OA\Property(property="note", type="integer"),
     *                 @OA\Property(property="date_de_publication", type="string", format="date-time"),
     *                 @OA\Property(property="status_avis", type="boolean"),
     *                 @OA\Property(property="id_utilisateur", type="integer"),
     *                 @OA\Property(property="id_spr", type="integer")
     *             )
     *         )
     *     )
     * )
     */
    public function index()
    {
        return Avis::with(['utilisateur', 'spr'])->get();
    }

    /**
     * @OA\Post(
     *     path="/api/avis",
     *     tags={"Avis"},
     *     security={{"bearerAuth": {}}},
     *     summary="Create a new review",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"titre","commentaire","note","id_utilisateur","id_spr"},
     *             @OA\Property(property="titre", type="string"),
     *             @OA\Property(property="commentaire", type="string"),
     *             @OA\Property(property="note", type="integer", minimum=0, maximum=5),
     *             @OA\Property(property="status_avis", type="boolean"),
     *             @OA\Property(property="id_utilisateur", type="integer"),
     *             @OA\Property(property="id_spr", type="integer")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Review created successfully"
     *     )
     * )
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'commentaire' => 'required|string',
            'note' => 'required|integer|between:0,5',
            'id_utilisateur' => 'required|exists:users,id',
            'id_spr' => 'required|exists:spr,id',
            'status_avis' => 'boolean'
        ]);

        $validated['date_de_publication'] = now();
        $validated['status_avis'] = $validated['status_avis'] ?? true;

        $avis = Avis::create($validated);
        return response()->json($avis, 201);
    }

    /**
     * @OA\Get(
     *     path="/api/avis/{id}",
     *     tags={"Avis"},
     *     security={{"bearerAuth": {}}},
     *     summary="Get specific review",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Review details"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Review not found"
     *     )
     * )
     */
    public function show(string $id)
    {
        $avis = Avis::with(['utilisateur', 'spr'])->findOrFail($id);
        return response()->json($avis);
    }

    
    /**
     * @OA\Delete(
     *     path="/api/avis/{id}",
     *     tags={"Avis"},
     *     security={{"bearerAuth": {}}},
     *     summary="Delete review",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="Review deleted successfully"
     *     )
     * )
     */
    public function destroy(string $id)
    {
        $avis = Avis::findOrFail($id);
        $avis->delete();
        return response()->json(null, 204);
    }
}
