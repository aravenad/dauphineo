<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Utilisateur;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

/**
 * @OA\Tag(
 *     name="utilisateur",
 *     description="Endpoints for the signed-in user"
 * )
 */
class UtilisateurController extends Controller
{
    /**
     * Un jeton volé ne doit pas suffire à prendre le compte : changer d'adresse ou de mot de passe
     * et supprimer le compte demandent le mot de passe actuel.
     */
    private function verifierMotDePasseActuel(Request $request, Utilisateur $user): void
    {
        $motDePasse = $request->validate(['mot_de_passe_actuel' => 'required|string'])['mot_de_passe_actuel'];

        if (! Hash::check($motDePasse, $user->mot_de_passe)) {
            throw ValidationException::withMessages(['mot_de_passe_actuel' => __('Le mot de passe actuel est incorrect.')]);
        }
    }

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
     *             @OA\Property(property="mot_de_passe_actuel", type="string", description="Required to change the email or the password"),
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
            'nom' => ['sometimes', 'string', 'max:50', 'regex:'.Utilisateur::REGLE_NOM],
            'prenom' => ['sometimes', 'string', 'max:50', 'regex:'.Utilisateur::REGLE_NOM],
            'email' => ['sometimes', 'string', 'email', 'max:255', Rule::unique('utilisateur', 'email')->ignore($user->id)],
            'mot_de_passe' => ['sometimes', 'string', Password::defaults()],
        ]);

        $changeMotDePasse = isset($data['mot_de_passe']);
        if ($changeMotDePasse || (isset($data['email']) && $data['email'] !== $user->email)) {
            $this->verifierMotDePasseActuel($request, $user);
        }

        $user->update($data);

        if ($changeMotDePasse) {
            // Les autres sessions, peut-être ouvertes par quelqu'un qui connaissait l'ancien mot de passe, sont fermées
            $user->tokens()->where('id', '!=', (int) $user->currentAccessToken()?->getKey())->delete();
        }

        return response()->json($user);
    }

    /**
     * @OA\Delete(
     *     path="/api/utilisateur",
     *     tags={"utilisateur"},
     *     security={{"bearerAuth": {}}},
     *     summary="Delete the signed-in user and their data",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(@OA\Property(property="mot_de_passe_actuel", type="string"))
     *     ),
     *     @OA\Response(response=204, description="User deleted"),
     *     @OA\Response(response=422, description="Missing or wrong current password")
     * )
     */
    public function destroy(Request $request)
    {
        $user = $request->user();
        $this->verifierMotDePasseActuel($request, $user);
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

        return response()->json(['message' => __('Déconnexion réussie')]);
    }
}
