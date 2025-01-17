<?php

namespace App\Http\Controllers\Api;

use Stripe\PaymentIntent;
use App\Models\Reservation;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

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
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Property(property="prix", type="number", format="float", example=10.99),
     *                 @OA\Property(property="taille", type="integer", example=3),
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
        if(!Auth::check()) {
            return response()->json(['message' => 'Vous devez être connecté pour effectuer votre réservation.'], 401);
        }

        // Validation des données entrantes
        $request->validate([
            'prix' => 'required|numeric|min:0.50',
            'taille' => 'required|integer|min:1',
            'id_visite' => 'nullable|integer|exists:visite,id',
            'id_spr' => 'required|integer|exists:spr,id',
            'id_guide' => 'required|integer|exists:guide,id',
        ]);

        // Création de la réservation en base de données
        $reservation = Reservation::create([
            'prix' => $request->prix,
            'taille' => $request->taille,
            'id_utilisateur' => Auth::id(),
            'id_visite' => $request->id_visite,
            'id_spr' => $request->id_spr,
            'id_guide' => $request->id_guide,
            'statut_reservation' => 'confirmee',
            'statut_paiement' => 'en_attente',
        ]);

        \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));

        try {
            $paymentIntent = PaymentIntent::create([
                'amount' => $request->prix * 100,
                'currency' => 'eur',
                'payment_method_types' => ['card'],
                'description' => 'Réservation ID' . $reservation->id,
            ]);
            return response()->json([
                'message' => 'Reservation created successfully',
                'clientSecret' => $paymentIntent->client_secret
            ], 201);
        } catch (\Stripe\Exception\ApiErrorException $e) {
            return response()->json([
                'message' => 'Payment creation failed'
            ], 500);
        }
    }
}
