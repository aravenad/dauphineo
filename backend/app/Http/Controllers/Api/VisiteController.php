<?php

namespace App\Http\Controllers\Api;

use App\Models\Visite;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * @OA\Tag(
 *     name="Visite",
 *     description="API Endpoints for Managing Visits"
 * )
 */
class VisiteController extends Controller
{
    /**
     * @OA\Get(
     *     tags={"Visite"},
     *     path="/api/visites",
     *     security={{"bearerAuth": {}}},
     *     summary="Get all visits",
     *     @OA\Response(
     *         response=200,
     *         description="Success"
     *     )
     * )
     */
    public function index()
    {

        $visites = Visite::all();

        if (!$visites) {
            return response()->json(data: ['message' => 'Une erreur est survenue']);
        }

        return response()->json($visites, 200);
    }

    /**
     * @OA\Get(
     *     tags={"Visite"},
     *     path="/api/visites/{id}",
     *     security={{"bearerAuth": {}}},
     *     summary="Get a specific visit",
     *     @OA\Parameter(
     *         name="id",
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
     *         description="Not Found"
     *     )
     * )
     */
    public function show($id)
    {

        $visite = Visite::findOrFail($id);
        
            
        if (!$visite) {
            return response()->json(['message' => 'Visite not found'], 404);
        }

            return response()->json($visite, 200);
    }
    

    /**
     * @OA\Post(
     *     tags={"Visite"},
     *     path="/api/visites",
     *    security={{"bearerAuth": {}}},
     *     summary="Create a new visit",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"capacite_actuelle", "capacite_max", "date_visite", "id_spr", "id_disponibilite"},
     *             @OA\Property(property="capacite_actuelle", type="integer", example=10),
     *             @OA\Property(property="capacite_max", type="integer", example=30),
     *             @OA\Property(property="date_visite", type="string", format="date", example="2024-01-15"),
     *             @OA\Property(property="id_spr", type="integer", example=1),
     *             @OA\Property(property="id_disponibilite", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Visit created successfully"
     *     )
     * )
     */
    public function store(Request $request)
    {

        $validated = $request->validate([
            'capacite_actuelle' => 'required|integer|min:0',
            'capacite_max' => 'required|integer|min:1',
            'date_visite' => 'required|date',
            'id_spr' => 'required|integer',
            'id_disponibilite' => 'required|integer'
        ]);

        if (!$validated) {
            return response()->json(['message' => 'Visite insertion failed'], 404);

        }

        $visite = Visite::create($validated);
        return response()->json($visite, 201);
        
    }

    /**
     * @OA\Delete(
     *     tags={"Visite"},
     *     path="/api/visites/{id}",
     *    security={{"bearerAuth": {}}},
     *     summary="Delete a visit",
     *     @OA\Parameter(
     *         name="id",
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
     *         description="Not Found"
     *     )
     * )
     */
    public function destroy($id)
    {
        $visite = Visite::find($id);
        
        if (!$visite) {
            return response()->json(['message' => 'Visite not found'], 404);
        }

        $visite->delete();

        return response()->json(['message' => 'Visite deleted successfully']);
    }

    /**
     * @OA\Get(
     *     tags={"Visite"},
     *     path="/api/visites/utilisateur/{userId}",
     *     security={{"bearerAuth": {}}},
     *     summary="Get all visits associated with a specific user",
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
     *         description="No visits found for this user"
     *     )
     * )
     */
    public function getUserVisites($userId)
    {
        try {
            // On commence par récupérer toutes les réservations de l'utilisateur
            $reservations = DB::table('reservation')
                ->select([
                    'visite.date_visite',
                    'spr.nom_commune as nom_spr',
                    'guide.prenom as prenom_guide'
                ])
                ->where('reservation.id_utilisateur', $userId)
                ->join('guide', 'reservation.id_guide', '=', 'guide.id')
                ->join('spr', 'reservation.id_spr', '=', 'spr.id')
                ->join('visite', 'reservation.id_visite', '=', 'visite.id')
                ->get();

            if ($reservations->isEmpty()) {
                return response()->json(['message' => 'No reservations found for this user'], 404);
            }

            // Pas besoin de transformer la réponse car chaque réservation est déjà unique
            return response()->json($reservations, 200);
            
        } catch (\Exception $e) {
            Log::error('Error fetching user reservations: ' . $e->getMessage());
            return response()->json([
                'message' => 'Une erreur est survenue',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     tags={"Visite"},
     *     path="/api/visites/spr/{sprId}",
     *     security={{"bearerAuth": {}}},
     *     summary="Get all visits for a specific SPR",
     *     @OA\Parameter(
     *         name="sprId",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success"
     *     )
     * )
     */
    public function getVisitesBySpr($sprId)
    {
        $visites = Visite::where('id_spr', $sprId)->get();

        if ($visites->isEmpty()) {
            return response()->json(['message' => 'No visits found for this SPR'], 404);
        }

        return response()->json($visites);
    }
}
