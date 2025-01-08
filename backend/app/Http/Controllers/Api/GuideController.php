<?php

namespace App\Http\Controllers\Api;

use App\Models\Guide;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

/**
 * @OA\Tag(
 *     name="Guides",
 *     description="API Endpoints for Guide management"
 * )
 */
class GuideController extends Controller
{
    // /**
    //  * @OA\Get(
    //  *     path="/api/guides",
    //  *     tags={"Guides"},
    //  *     security={{"bearerAuth": {}}},
    //  *     summary="Get all guides",
    //  *     @OA\Response(
    //  *         response=200,
    //  *         description="List of guides"
    //  *     )
    //  * )
    //  */
    // public function index()
    // {
    //     return Guide::with(['spr', 'disponibilites'])->get();
    // }

    // /**
    //  * @OA\Post(
    //  *     path="/api/guides",
    //  *     tags={"Guides"},
    //  *     security={{"bearerAuth": {}}},
    //  *     summary="Create a new guide",
    //  *     @OA\RequestBody(
    //  *         required=true,
    //  *         @OA\JsonContent(
    //  *             required={"nom","prenom","email","pseudo","mot_de_passe","id_spr"},
    //  *             @OA\Property(property="nom", type="string"),
    //  *             @OA\Property(property="prenom", type="string"),
    //  *             @OA\Property(property="email", type="string", format="email"),
    //  *             @OA\Property(property="pseudo", type="string"),
    //  *             @OA\Property(property="mot_de_passe", type="string", format="password"),
    //  *             @OA\Property(property="verif_age", type="boolean"),
    //  *             @OA\Property(property="id_spr", type="integer"),
    //  *             @OA\Property(property="derniere_activite", type="string", format="date-time")
    //  *         )
    //  *     ),
    //  *     @OA\Response(
    //  *         response=201,
    //  *         description="Guide created successfully"
    //  *     )
    //  * )
    //  */
    // public function store(Request $request)
    // {
    //     $validated = $request->validate([
    //         'nom' => 'required|string|max:255',
    //         'prenom' => 'required|string|max:255',
    //         'email' => 'required|string|email|max:255|unique:guides',
    //         'pseudo' => 'required|string|max:255|unique:guides',
    //         'mot_de_passe' => 'required|string|min:8',
    //         'verif_age' => 'boolean',
    //         'id_spr' => 'required|exists:spr,id',
    //         'derniere_activite' => 'nullable|date'
    //     ]);

    //     $validated['mot_de_passe'] = bcrypt($request->mot_de_passe);
    //     $validated['derniere_activite'] = $validated['derniere_activite'] ?? now();
    //     $validated['verif_age'] = $validated['verif_age'] ?? false;

    //     $guide = Guide::create($validated);
    //     return response()->json($guide, 201);
    // }

    // /**
    //  * @OA\Get(
    //  *     path="/api/guides/{id}",
    //  *     tags={"Guides"},
    //  *     security={{"bearerAuth": {}}},
    //  *     summary="Get specific guide",
    //  *     @OA\Parameter(
    //  *         name="id",
    //  *         in="path",
    //  *         required=true,
    //  *         @OA\Schema(type="integer")
    //  *     ),
    //  *     @OA\Response(
    //  *         response=200,
    //  *         description="Guide details"
    //  *     ),
    //  *     @OA\Response(
    //  *         response=404,
    //  *         description="Guide not found"
    //  *     )
    //  * )
    //  */
    // public function show(string $id)
    // {
    //     $guide = Guide::with(['spr', 'disponibilites', 'reservations'])->findOrFail($id);
    //     return response()->json($guide);
    // }

    // /**
    //  * @OA\Put(
    //  *     path="/api/guides/{id}",
    //  *     tags={"Guides"},
    //  *     security={{"bearerAuth": {}}},
    //  *     summary="Update guide",
    //  *     @OA\Parameter(
    //  *         name="id",
    //  *         in="path",
    //  *         required=true,
    //  *         @OA\Schema(type="integer")
    //  *     ),
    //  *     @OA\RequestBody(
    //  *         required=true,
    //  *         @OA\JsonContent(
    //  *             @OA\Property(property="nom", type="string"),
    //  *             @OA\Property(property="prenom", type="string"),
    //  *             @OA\Property(property="email", type="string", format="email"),
    //  *             @OA\Property(property="pseudo", type="string"),
    //  *             @OA\Property(property="mot_de_passe", type="string", format="password"),
    //  *             @OA\Property(property="verif_age", type="boolean"),
    //  *             @OA\Property(property="id_spr", type="integer"),
    //  *             @OA\Property(property="derniere_activite", type="string", format="date-time")
    //  *         )
    //  *     ),
    //  *     @OA\Response(
    //  *         response=200,
    //  *         description="Guide updated successfully"
    //  *     )
    //  * )
    //  */
    // public function update(Request $request, string $id)
    // {
    //     $guide = Guide::findOrFail($id);
        
    //     $validated = $request->validate([
    //         'nom' => 'string|max:255',
    //         'prenom' => 'string|max:255',
    //         'email' => 'string|email|max:255|unique:guides,email,' . $id,
    //         'pseudo' => 'string|max:255|unique:guides,pseudo,' . $id,
    //         'mot_de_passe' => 'nullable|string|min:8',
    //         'verif_age' => 'boolean',
    //         'id_spr' => 'exists:spr,id',
    //         'derniere_activite' => 'nullable|date'
    //     ]);

    //     if ($request->has('mot_de_passe')) {
    //         $validated['mot_de_passe'] = bcrypt($request->mot_de_passe);
    //     }

    //     $guide->update($validated);
    //     return response()->json($guide);
    // }

    // /**
    //  * @OA\Delete(
    //  *     path="/api/guides/{id}",
    //  *     tags={"Guides"},
    //  *     security={{"bearerAuth": {}}},
    //  *     summary="Delete guide",
    //  *     @OA\Parameter(
    //  *         name="id",
    //  *         in="path",
    //  *         required=true,
    //  *         @OA\Schema(type="integer")
    //  *     ),
    //  *     @OA\Response(
    //  *         response=204,
    //  *         description="Guide deleted successfully"
    //  *     )
    //  * )
    //  */
    // public function destroy(string $id)
    // {
    //     $guide = Guide::findOrFail($id);
    //     $guide->delete();
    //     return response()->json(null, 204);
    // }
}
