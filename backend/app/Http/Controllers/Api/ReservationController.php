<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Utilisateur;
use App\Models\Visite;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

/**
 * @OA\Tag(
 *     name="reservation",
 *     description="Endpoints for booking guided visits"
 * )
 */
class ReservationController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/reservations",
     *     tags={"reservation"},
     *     security={{"bearerAuth": {}}},
     *     summary="Book places on a visit",
     *     description="The SPR, the guide and the price are derived from the visit. Payment stays pending: the site does not take payments.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="id_visite", type="integer", example=1),
     *             @OA\Property(property="taille", type="integer", minimum=1, example=2),
     *         )
     *     ),
     *     @OA\Response(response=201, description="Reservation created"),
     *     @OA\Response(response=409, description="Not enough places left"),
     *     @OA\Response(response=422, description="Validation error, past visit or too many upcoming reservations")
     * )
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'id_visite' => 'required|integer|exists:visite,id',
            'taille' => 'required|integer|min:1|max:50',
        ]);

        $visite = Visite::with('disponibilite')->findOrFail($data['id_visite']);

        if ($visite->date_visite->lt(Carbon::today())) {
            return response()->json(['message' => __('Cette visite est déjà passée.')], 422);
        }

        try {
            $reservation = DB::transaction(function () use ($data, $visite) {
                // Le verrou sur le compte empêche deux requêtes simultanées de dépasser le plafond ensemble
                Utilisateur::whereKey(Auth::id())->lockForUpdate()->first();

                $aVenir = Reservation::where('id_utilisateur', Auth::id())
                    ->whereHas('visite', fn ($requete) => $requete->whereDate('date_visite', '>=', Carbon::today()))
                    ->count();
                if ($aVenir >= Reservation::MAX_A_VENIR_PAR_COMPTE) {
                    return null;
                }

                // Le trigger trigger_reserve_visit_capacity décompte les places ou refuse la réservation
                return Reservation::create([
                    'prix' => $data['taille'] * Reservation::PRIX_PAR_PERSONNE,
                    'taille' => $data['taille'],
                    'id_utilisateur' => Auth::id(),
                    'id_visite' => $visite->id,
                    'id_spr' => $visite->id_spr,
                    'id_guide' => $visite->disponibilite->id_guide,
                ]);
            });
        } catch (QueryException $e) {
            if (str_contains($e->getMessage(), 'Capacité dépassée')) {
                return response()->json(['message' => __('Il ne reste pas assez de places pour cette visite.')], 409);
            }
            throw $e;
        }

        if ($reservation === null) {
            return response()->json([
                'message' => __('Vous avez déjà :max visites à venir. Annulez-en une pour en réserver une autre.', [
                    'max' => Reservation::MAX_A_VENIR_PAR_COMPTE,
                ]),
            ], 422);
        }

        return response()->json(
            $reservation->fresh()->load(['spr:id,nom_commune', 'guide:id,nom,prenom', 'visite.disponibilite.creneaux']),
            201
        );
    }

    /**
     * @OA\Delete(
     *     path="/api/reservations/{id}",
     *     tags={"reservation"},
     *     security={{"bearerAuth": {}}},
     *     summary="Cancel one of your upcoming reservations",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=204, description="Reservation cancelled, places released"),
     *     @OA\Response(response=403, description="The reservation belongs to someone else"),
     *     @OA\Response(response=422, description="The visit already took place")
     * )
     */
    public function destroy(string $id)
    {
        $reservation = Reservation::with('visite')->findOrFail($id);

        if ($reservation->id_utilisateur !== Auth::id()) {
            return response()->json(['message' => __('Vous n\'êtes pas autorisé à annuler cette réservation.')], 403);
        }

        if ($reservation->visite->date_visite->lt(Carbon::today())) {
            return response()->json(['message' => __('Une visite passée ne peut plus être annulée.')], 422);
        }

        // Le trigger trg_delete_reservation_on_status supprime la ligne et libère les places
        $reservation->update(['statut_reservation' => 'annulee']);

        return response()->noContent();
    }
}
