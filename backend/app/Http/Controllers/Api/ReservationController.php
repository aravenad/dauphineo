<?php

namespace App\Http\Controllers\Api;

use App\Models\Reservation;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;



/**
 * @OA\Tag(
 *     name="reservation",
 *     description="Endpoints for managing reservations"
 * )
 */
class ReservationController extends Controller
{

    /**
     * @OA\Post(
     *     tags={"reservation"},
     *     path="/api/reservations",
     *     security={{"bearerAuth": {}}},
     *     summary="Store a new reservation",
     *     description="This endpoint allows users to create a new reservation.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 type="object",
     *                 required={"date", "heure", "prix", "statut_reservation", "statut_paiement", "taille", "id_utilisateur"},
     *                 @OA\Property(property="date", type="string", format="date", example="2025-01-07"),
     *                 @OA\Property(property="heure", type="string", format="time", example="14:30:00"),
     *                 @OA\Property(property="prix", type="number", format="float", example=50.75),
     *                 @OA\Property(property="statut_reservation", type="string", example="confirmée"),
     *                 @OA\Property(property="statut_paiement", type="string", example="payé"),
     *                 @OA\Property(property="taille", type="integer", example=3),
     *                 @OA\Property(property="id_utilisateur", type="integer", example=1),
     *                 @OA\Property(property="id_visite", type="integer", nullable=true, example=1),
     *                 @OA\Property(property="id_spr", type="integer", nullable=true, example=1),
     *                 @OA\Property(property="id_guide", type="integer", nullable=true, example=2)
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Reservation created successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Reservation created successfully"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Validation failed"
     *     )
     * )
     */
    public function store(Request $request)
    {
        // Validation des données entrantes
        $data = $request->validate([
            'date' => 'required|date',
            'heure' => 'required|date_format:H:i:s',
            'prix' => 'required|numeric|min:0.50',
            'statut_reservation' => 'required|string|in:confirmée,en cours,annulée',
            'statut_paiement' => 'required|string|in:payé,en attente,annulé',
            'taille' => 'required|integer|min:1',
            'id_utilisateur' => 'required|integer|exists:utilisateur,id',
            'id_visite' => 'nullable|integer|exists:visite,id',
            'id_spr' => 'nullable|integer|exists:spr,id',
            'id_guide' => 'nullable|integer|exists:guide,id',
        ]);

        // Création de la réservation
        $reservation = Reservation::create($data);

        // Retourner une réponse JSON
        return $reservation;
    }

    /**
     * @OA\Put(
     *     tags = {"reservation"},
     *     path="/api/reservations/{id}",
     *     security={{"bearerAuth": {}}},
     *     summary="Update the status of a reservation",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Property(property="statut_reservation", type="string", example="annulé")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Not Found"
     *     )
     * )
     */
    public function updateStatus(Request $request, $id)
    {
        // Rechercher la réservation
        $reservation = Reservation::find($id);

        // if (!$reservation) {
        //     return response()->json(['message' => 'Reservation not found'], 404);
        // }

        // // Validation du statut ENUM
        // $request->validate([
        //     'statut_reservation' => 'required|string|in:terminé,en cours,annulé'
        // ]);

        // // Mise à jour du statut
        // $reservation->statut_reservation = $request->statut_reservation;
        // $reservation->save();

        // return response()->json(['message' => 'Reservation status updated successfully'], 200);
    }
}
