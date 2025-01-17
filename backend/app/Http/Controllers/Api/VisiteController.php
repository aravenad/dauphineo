<?php

namespace App\Http\Controllers\Api;

use App\Models\Visite;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

/**
 * @OA\Tag(
 *     name="visite",
 *     description="Endpoints for managing visits"
 * )
 */
class VisiteController extends Controller
{
    /**
     * @OA\Get(
     *     tags={"visite"},
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

        return $visites;
    }

    /**
     * @OA\Get(
     *     tags={"visite"},
     *     path="/api/visites/{id}",
     *     security={{"bearerAuth": {}}},
     *     summary="Fetch one visit",
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
             
        return $visite;
    }


    /**
     * @OA\Post(
     *     tags={"visite"},
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
     *     tags={"visite"},
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
        $visite = Visite::findOrFail($id);

        $visite->delete();

        return response()->noContent();
    }

    // /**
    //  * @OA\Get(
    //  *     tags={"visite"},
    //  *     path="/api/visites/spr/{sprId}",
    //  *     security={{"bearerAuth": {}}},
    //  *     summary="Get all visits for a specific SPR",
    //  *     @OA\Parameter(
    //  *         name="sprId",
    //  *         in="path",
    //  *         required=true,
    //  *         @OA\Schema(type="integer")
    //  *     ),
    //  *     @OA\Response(
    //  *         response=200,
    //  *         description="Success"
    //  *     )
    //  * )
    //  */
    // public function getVisitesBySpr($sprId)
    // {
    //     $visites = Visite::where('id_spr', $sprId)->get();

    //     if ($visites->isEmpty()) {
    //         return response()->json(['message' => 'No visits found for this SPR'], 404);
    //     }

    //     return response()->json($visites);
    // }
}
