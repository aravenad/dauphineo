<?php

namespace App\Http\Controllers\Api;

use App\Models\Avis;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB; // Ajout de l'import DB
use Illuminate\Support\Facades\Log; // Ajout de l'import Log

/**
 * @OA\Tag(
 *     name="avis",
 *     description="Endpoints for managing reviews"
 * )
 */
class AvisController extends Controller
{
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
        return response()->noContent();
    }

    /**
     * @OA\Get(
     *     tags={"Avis"},
     *     path="/api/avis/utilisateur/{userId}",
     *     security={{"bearerAuth": {}}},
     *     summary="Get all reviews associated with a specific user",
     *     @OA\Parameter(
     *         name="userId",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No reviews found for this user"
     *     )
     * )
     */

    
     public function getUserAvis($userId)
     {
         try {
             // Modification de la requête pour correspondre à votre structure
             $avis = DB::table('avis')
                 ->select([
                     'avis.titre',
                     'avis.commentaire',
                     'avis.note',
                     'avis.date_de_publication',
                 ])
                 ->where('avis.id_utilisateur', $userId)
                 ->join('spr', 'avis.id_spr', '=', 'spr.id') // Joindre la table SPR pour obtenir des informations sur le SPR
                 ->get();
     
             if ($avis->isEmpty()) {
                 return response()->json(['message' => 'Aucun avis trouvé pour cet utilisateur'], 404);
             }
     
             return response()->json($avis, 200);
             
         } catch (\Exception $e) {
             Log::error('Erreur lors de la récupération des avis: ' . $e->getMessage());
             return response()->json([
                 'message' => 'Une erreur est survenue lors de la récupération des avis',
                 'error' => $e->getMessage()
             ], 500);
         }
     }     
}
