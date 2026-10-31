<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Avis;
use App\Models\Spr;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
     *     path="/api/spr/{id}/avis",
     *     tags={"avis"},
     *     summary="List the reviews of a SPR, newest first",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Success")
     * )
     */
    public function indexBySpr(string $id)
    {
        $spr = Spr::findOrFail($id);

        return $spr->avis()->with('utilisateur:id,pseudo')->latest()->get();
    }

    /**
     * @OA\Post(
     *     path="/api/avis",
     *     tags={"avis"},
     *     security={{"bearerAuth": {}}},
     *     summary="Create a review",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="titre", type="string", example="Une expérience inoubliable"),
     *             @OA\Property(property="commentaire", type="string", example="J'ai visité ce SPR, c'était génial !"),
     *             @OA\Property(property="note", type="integer", minimum=1, maximum=5, example=5),
     *             @OA\Property(property="id_spr", type="integer", example=1),
     *         )
     *     ),
     *     @OA\Response(response=201, description="Review created"),
     *     @OA\Response(response=409, description="The user already reviewed this SPR")
     * )
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'titre' => 'required|string|max:255',
            'commentaire' => 'required|string|max:2000',
            'note' => 'required|integer|between:1,5',
            'id_spr' => 'required|integer|exists:spr,id',
        ]);

        $data['id_utilisateur'] = Auth::id();

        $dejaPublie = response()->json(['message' => 'Vous avez déjà laissé un avis pour ce SPR.'], 409);

        if (Avis::where('id_utilisateur', $data['id_utilisateur'])->where('id_spr', $data['id_spr'])->exists()) {
            return $dejaPublie;
        }

        try {
            $avis = Avis::create($data)->load('utilisateur:id,pseudo');
        } catch (UniqueConstraintViolationException) {
            // Deux envois simultanés passent tous les deux la vérification : la contrainte unique tranche
            return $dejaPublie;
        }

        return response()->json($avis, 201);
    }

    /**
     * @OA\Get(
     *     path="/api/avis/{id}",
     *     tags={"avis"},
     *     summary="Get a review",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Success"),
     *     @OA\Response(response=404, description="Review not found")
     * )
     */
    public function show(string $id)
    {
        return Avis::with('utilisateur:id,pseudo')->findOrFail($id);
    }

    /**
     * @OA\Delete(
     *     path="/api/avis/{id}",
     *     tags={"avis"},
     *     security={{"bearerAuth": {}}},
     *     summary="Delete one of your reviews",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=204, description="Review deleted"),
     *     @OA\Response(response=403, description="The review belongs to someone else")
     * )
     */
    public function destroy(string $id)
    {
        $avis = Avis::findOrFail($id);

        if ($avis->id_utilisateur !== Auth::id()) {
            return response()->json(['message' => 'Vous n\'êtes pas autorisé à supprimer cet avis.'], 403);
        }

        $avis->delete();

        return response()->noContent();
    }
}
