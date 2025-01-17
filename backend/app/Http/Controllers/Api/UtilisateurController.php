<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use App\Models\Reservation;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;


/**
 * @OA\Tag(
 *     name="utilisateur",
 *     description="Endpoints for utilisateur"
 * )
 */
class UtilisateurController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/utilisateur",
     *     tags={"utilisateur"},
     *     summary="Show one user",
     *     security={{"bearerAuth": {}}},
     *       @OA\Response(
     *         response=200,
     *         description="User found",
     *         @OA\JsonContent(
     *             type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="nom", type="string", example="Doe"),
     *                 @OA\Property(property="prenom", type="string", example="John"),
     *                 @OA\Property(property="email", type="string", example="john.doe@example.com"),
     *         )
     *     ),
     *     @OA\Response(
     *       response=404,
     *       description="User not found",
     *        @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="User not found")
     *         )
     *     )
     * )
     */
    public function show()
    {
        if (Auth::check()) {
            $user = Auth::user();
            return response()->json($user, 200);
        } else {
            return response()->json(['message' => 'User not found'], 404);
        }
    }

    /**
     * @OA\Put(
     *     path="/api/utilisateur",
     *     tags={"utilisateur"},
     *     security={{"bearerAuth": {}}},
     *     summary="Update user",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Property(property="nom", type="string", example="Doe"),
     *                 @OA\Property(property="prenom", type="string", example="John"),
     *                 @OA\Property(property="pseudo", type="string", example="john.doe"),
     *                 @OA\Property(property="email", type="string", example="john.doe@gmail.com"),
     *                 @OA\Property(property="mot_de_passe", type="string", example="securepassword123"),
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="User updated successfully",
     *         @OA\JsonContent(
     *             type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="prenom", type="string", example="John"),
     *                 @OA\Property(property="pseudo", type="string", example="john.doe"),
     *                 @OA\Property(property="email", type="string", example="john.doe@gmail.com")
     *         )
     *     ),
     *     @OA\Response(
     *       response=404,
     *       description="User not found",
     *        @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="User not found")
     *         )
     *     )
     * )
     */
    public function update(Request $request)
    {
        if (Auth::check()) {

            $user = $request->user();

            $request->validate([
                'nom' => 'string|max:255',
                'prenom' => 'string|max:255',
                'email' => 'string|email|max:255',
                'mot_de_passe' => 'string|min:8'
            ]);

            $user->update($request->all());

            return response()->json([
                'message' => 'User updated successfully',
                'user' => $user,
            ], 201);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/utilisateur",
     *     security={{"bearerAuth": {}}},
     *     tags={"utilisateur"},
     *     summary="Delete one user",
     *     @OA\Response(
     *         response=204,
     *         description="User deleted successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="User deleted")
     *         )
     *     ),
     *     @OA\Response(
     *       response=404,
     *       description="User not found",
     *        @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="User not found")
     *         )
     *     )
     * )
     */
    public function destroy()
    {
        if (Auth::check()) {

            $id = Auth::id();
            $user = Utilisateur::find($id);

            if (!$user) {
                return response()->json([
                    'message' => 'Utilisateur non trouvé'
                ]);
            }
            $user->delete();
            return response()->json([
                'message' => 'User deleted successfully'
            ], 204);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/utilisateur/reservations",
     *     tags={"utilisateur"},
     *     security={{"bearerAuth": {}}},
     *     summary="Fetch user's reservations",
     *       @OA\Response(
     *         response=200,
     *         description="User found",
     *         @OA\JsonContent(
     *             type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="prix", type="string", example="10.99"),
     *                 @OA\Property(property="taille", type="string", example="3"),
     *                 @OA\Property(property="id_utilisateur", type="integer", example="1"),
     *                 @OA\Property(property="id_visite", type="integer", example="1"),
     *                 @OA\Property(property="id_spr", type="integer", example="1"),
     *                 @OA\Property(property="id_guide", type="integer", example="2"),
     *                 @OA\Property(property="created_at", type="string", example="2025-01-14 10:56:02.000"),
     *         )
     *     ),
     *     @OA\Response(
     *       response=404,
     *       description="User not found",
     *        @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="User not found")
     *         )
     *     )
     * )
     */
    public function getUserReservations()
    {
        if (Auth::check()) {

            $id = Auth::id();

            $reservations = Utilisateur::with(['reservations'])->where('id', $id)->get();
            return $reservations;
        };
    }

    /**
     * @OA\Get(
     *     tags={"utilisateur"},
     *     path="/api/utilisateur/visites",
     *     security={{"bearerAuth": {}}},
     *     summary="Fetch all user's visits",
     *     @OA\Response(
     *         response=200,
     *         description="Success"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No visits found for this user"
     *     )
     * )
     */
    public function getUserVisites()
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $userAuthId = Auth::id();

        $reservations = Reservation::with(['guide', 'spr', 'visite'])
            ->where('id_utilisateur', $userAuthId)
            ->get(['id', 'id_utilisateur', 'id_visite', 'id_spr', 'id_guide']);

        $futureVisits = $reservations->filter(function ($reservation) {
            return $reservation->visite->date_visite >= Carbon::today();
        });

        $pastVisits = $reservations->filter(function ($reservation) {
            return $reservation->visite->date_visite < Carbon::today();
        });

        return response()->json([
            'v_future' => $futureVisits,
            'v_passees' => $pastVisits
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/utilisateur/logout",
     *     tags={"utilisateur"},
     *     security={{"bearerAuth": {}}},
     *     summary="User logout",
     *     @OA\Response(
     *         response=200,
     *         description="User logged out",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Déconnexion réussie")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="No user logged in",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Aucun utilisateur connecté")
     *         )
     *     )
     * )
     */
    public function logout(Request $request)
    {
        $user = $request->user();

        if (Auth::check()) {

            $user->tokens->each(function ($token) {
                $token->delete();
            });

            return response()->json([
                'message' => 'Déconnexion réussie'
            ]);
        }
    }
}
