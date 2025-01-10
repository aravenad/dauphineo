<?php

namespace App\Http\Controllers\Api;

use App\Models\Avis;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

/**
 * @OA\Tag(
 *     name="avis",
 *     description="Endpoints for managing reviews"
 * )
 */
class AvisController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/avis",
     *     tags={"avis"},
     *     security={{"bearerAuth": {}}},
     *     summary="Fetch all reviews from all reviews",
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example="1"),
     *                 @OA\Property(property="titre", type="string", example="Super visite"),
     *                 @OA\Property(property="commentaire", type="string", example="Très belle expérience, guide au top !"),
     *                 @OA\Property(property="note", type="integer", example="5"),
     *                 @OA\Property(property="date_de_publication", type="string", format="date-time", example="2025-01-07 09:06:47"),
     *                 @OA\Property(property="id_spr", type="integer", example="1"),
     *                 @OA\Property(property="utilisateur", type="object", example={"nom": "Dupont", "prenom": "Jean", "pseudo": "jean.dupont"}),
     *)
     *         )
     *     )
     * )
     */
    public function index()
    {
        return Avis::all();
    }

    /**
     * @OA\Post(
     *     path="/api/avis",
     *     tags={"avis"},
     *     security={{"bearerAuth": {}}},
     *     summary="Create a review",
     *     @OA\RequestBody(
     *         required=true,
     *          @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Property(property="titre", type="string", example="Une expérience inoubliable"),
     *                 @OA\Property(property="commentaire", type="string", example="J'ai visité ce SPR, c'était génial !"),
     *                 @OA\Property(property="note", type="integer", example="5"),
     *                 @OA\Property(property="id_utilisateur", type="integer", example="1"),
     *                 @OA\Property(property="id_spr", type="integer", example="1"),
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Review created successfully",
     *           @OA\JsonContent(
     *             type="object",
     *              @OA\Property(property="titre", type="string", example="Une expérience inoubliable"),
     *                 @OA\Property(property="commentaire", type="string", example="J'ai visité ce SPR, c'était génial !"),
     *                 @OA\Property(property="note", type="integer", example="5"),
     *                 @OA\Property(property="id_utilisateur", type="integer", example="1"),
     *                 @OA\Property(property="id_spr", type="integer", example="1"),
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'titre' => 'required|string|max:255',
            'commentaire' => 'required|string',
            'note' => 'required|integer|between:0,5',
            'id_utilisateur' => 'required|integer',
            'id_spr' => 'required|integer',
        ]);

        // Vérification si l'utilisateur a déjà laissé un avis pour ce SPR
        $existingAvis = Avis::where('id_utilisateur', $data['id_utilisateur'])
            ->where('id_spr', $data['id_spr'])
            ->first();

        // Si un avis existe déjà, retourner une erreur
        if ($existingAvis) {
            return response()->json(['message' => 'Vous avez déjà laissé un avis pour ce SPR.'], 400);
        }

        $data['date_de_publication'] = now();

        // Création de l'avis
        $avis = Avis::create($data);

        return response()->json($avis, 201);
    }

    /**
     * @OA\Get(
     *     path="/api/avis/{id}",
     *     tags={"avis"},
     *     security={{"bearerAuth": {}}},
     *     summary="Show one review",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *           @OA\JsonContent(
     *             type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="titre", type="string", example="Super visite"),
     *                 @OA\Property(property="commentaire", type="string", example="Très belle expérience, guide au top !"),
     *                 @OA\Property(property="note", type="integer", example="5"),
     *                 @OA\Property(property="date_de_publication", type="string", example="2024-03-02T18:00:00.000000Z"),
     *                 @OA\Property(property="id_spr", type="integer", example="1"),
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Review not found",
     *          @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Review not found")
     *         )
     *     )
     * )
     */
    public function show(string $id)
    {
        $avis = Avis::findOrFail($id);
        return response()->json($avis);
    }

    /**
     * @OA\Delete(
     *     path="/api/avis/{id}",
     *     tags={"avis"},
     *     security={{"bearerAuth": {}}},
     *     summary="Delete one review",
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
        return response()->json(["message" => "Avis supprimé avec succès", 204]);
    }
}
