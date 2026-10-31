<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * @OA\Tag(
 *     name="utilisateur",
 *     description="Endpoints for the signed-in user"
 * )
 */
class UtilisateurController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/utilisateur",
     *     tags={"utilisateur"},
     *     security={{"bearerAuth": {}}},
     *     summary="Get the signed-in user",
     *     @OA\Response(response=200, description="Success"),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function show(Request $request)
    {
        return $request->user();
    }

    /**
     * @OA\Put(
     *     path="/api/utilisateur",
     *     tags={"utilisateur"},
     *     security={{"bearerAuth": {}}},
     *     summary="Update the signed-in user",
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             @OA\Property(property="nom", type="string"),
     *             @OA\Property(property="prenom", type="string"),
     *             @OA\Property(property="email", type="string"),
     *             @OA\Property(property="mot_de_passe", type="string", minLength=8),
     *         )
     *     ),
     *     @OA\Response(response=200, description="User updated"),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'nom' => 'sometimes|string|max:50',
            'prenom' => 'sometimes|string|max:50',
            'email' => ['sometimes', 'string', 'email', 'max:255', Rule::unique('utilisateur', 'email')->ignore($user->id)],
            'mot_de_passe' => 'sometimes|string|min:8',
        ]);

        $user->update($data);

        return response()->json($user);
    }

    /**
     * @OA\Delete(
     *     path="/api/utilisateur",
     *     tags={"utilisateur"},
     *     security={{"bearerAuth": {}}},
     *     summary="Delete the signed-in user and their data",
     *     @OA\Response(response=204, description="User deleted")
     * )
     */
    public function destroy(Request $request)
    {
        $user = $request->user();
        $user->tokens()->delete();
        $user->delete();

        return response()->noContent();
    }

    /**
     * @OA\Get(
     *     path="/api/utilisateur/reservations",
     *     tags={"utilisateur"},
     *     security={{"bearerAuth": {}}},
     *     summary="List the reservations of the signed-in user",
     *     @OA\Response(response=200, description="Success")
     * )
     */
    public function getUserReservations(Request $request)
    {
        return $request->user()->reservations()
            ->with(['spr:id,nom_commune', 'guide:id,nom,prenom', 'visite.disponibilite.creneaux'])
            ->latest()
            ->get();
    }

    /**
     * @OA\Get(
     *     path="/api/utilisateur/visites",
     *     tags={"utilisateur"},
     *     security={{"bearerAuth": {}}},
     *     summary="Split the reservations of the signed-in user into upcoming and past visits",
     *     @OA\Response(response=200, description="Success")
     * )
     */
    public function getUserVisites(Request $request)
    {
        $reservations = Reservation::with(['guide:id,nom,prenom', 'spr:id,nom_commune', 'visite.disponibilite.creneaux'])
            ->where('id_utilisateur', $request->user()->id)
            ->get();

        [$futures, $passees] = $reservations->partition(
            fn ($reservation) => $reservation->visite->date_visite->gte(Carbon::today())
        );

        return response()->json([
            'v_future' => $futures->sortBy('visite.date_visite')->values(),
            'v_passees' => $passees->sortByDesc('visite.date_visite')->values(),
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/utilisateur/avis",
     *     tags={"utilisateur"},
     *     security={{"bearerAuth": {}}},
     *     summary="List the reviews written by the signed-in user",
     *     @OA\Response(response=200, description="Success")
     * )
     */
    public function getUserAvis(Request $request)
    {
        return $request->user()->avis()->with('spr:id,nom_commune')->latest()->get();
    }

    /**
     * @OA\Post(
     *     path="/api/utilisateur/logout",
     *     tags={"utilisateur"},
     *     security={{"bearerAuth": {}}},
     *     summary="Revoke the current access token",
     *     @OA\Response(response=200, description="Logged out")
     * )
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnexion réussie']);
    }
}
