<?php
namespace App\Http\Controllers\Api;

use App\Models\Guide;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

/**
 * @OA\Tag(
 *     name="Guides",
 *     description="Endpoints for Guide management"
 * )
 */
class GuideController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/guides",
     *     tags={"Guides"},
     *     security={{"bearerAuth": {}}},
     *     summary="Get all guides",
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example="1"),
     *                 @OA\Property(property="nom", type="string", example="Dupont"),
     *                 @OA\Property(property="prenom", type="string", example="Jean"),
     *                 @OA\Property(property="email", type="string", example="jean.dupont@example.com"),
     *                 @OA\Property(property="pseudo", type="string", example="jdupont"),
     *                 @OA\Property(property="verif_age", type="boolean", example="true"),
     *                 @OA\Property(property="derniere_activite", type="string", format="date-time", example="2025-01-07T00:00:00Z"),
     *                 @OA\Property(property="id_spr", type="integer", example=1),
     *             )
     *         )
     *     )
     * )
     */
    public function index()
    {
        try {
            $guides = Guide::with(['spr', 'disponibilites'])->get();
            return response()->json($guides, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Une erreur est survenue lors de la récupération des guides',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/guides/{id}",
     *     tags={"Guides"},
     *     security={{"bearerAuth": {}}},
     *     summary="Get specific guide",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Guide details"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Guide not found"
     *     )
     * )
     */
    public function show(string $id)
    {
        $guide = Guide::with(['spr', 'disponibilites'])->findOrFail($id);
        return response()->json($guide, 200);
    }



    /**
     * @OA\Put(
     *     path="/api/guides/{id}",
     *     tags={"Guides"},
     *     security={{"bearerAuth": {}}},
     *     summary="Update guide",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *                 @OA\Property(property="nom", type="string", example="Dupont"),
     *                 @OA\Property(property="prenom", type="string", example="Jean"),
     *                 @OA\Property(property="mot_de_passe", type="string", example="securepassword123"),
     *                 @OA\Property(property="email", type="string", example="jean.dupont@example.com"),
     *                 @OA\Property(property="pseudo", type="string", example="jdupont"),
     *                 @OA\Property(property="verif_age", type="boolean", example="true"),
     *                 @OA\Property(property="derniere_activite", type="string", format="date-time", example="2025-01-07T00:00:00Z"),
     *                 @OA\Property(property="id_spr", type="integer", example="1"),
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Guide updated successfully"
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
        $guide = Guide::find($id);

        if (!$guide) {
            return response()->json([
                'message' => 'guide non trouvé'
            ]);
        }

        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => "required|string|email|max:255|unique:guide,email",
            'pseudo' => "required|string|max:255|unique:guide,pseudo",
            'mot_de_passe' => 'nullable|string|min:8',
            'verif_age' => 'required|boolean',
            'id_spr' => 'required|exists:spr,id',
            'derniere_activite' => 'nullable|date'
        ]);

        $guide->update($request->all());
        return response()->json($guide, 200);
    }

    /**
     * @OA\Delete(
     *     path="/api/guides/{id}",
     *     tags={"Guides"},
     *     security={{"bearerAuth": {}}},
     *     summary="Delete guide",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="Guide deleted successfully"
     *     )
     * )
     */
    public function destroy(string $id)
    {
        $guide = Guide::findOrFail($id);
        $guide->delete();
        return response()->json(null, 204);
    }

    /**
     * @OA\Post(
     *     path="/api/guides",
     *     tags={"Guides"},
     *     security={{"bearerAuth": {}}},
     *     summary="Create a guide",
     *     @OA\RequestBody(
     *         required=true,
     *          @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Property(property="nom", type="string", example="Dupont"),
     *                 @OA\Property(property="prenom", type="string", example="Jean"),
     *                 @OA\Property(property="email", type="string", example="jean.dupont@example.com"),
     *                 @OA\Property(property="pseudo", type="string", example="jdupont"),
     *                @OA\Property(property="mot_de_passe", type="string", example="securepassword123"),
     *                 @OA\Property(property="verif_age", type="boolean", example="true"),
     *                 @OA\Property(property="derniere_activite", type="string", format="date-time", example="2025-01-07T00:00:00Z"),
     *                 @OA\Property(property="id_spr", type="integer", example="1"),
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="guide created successfully",
     *           @OA\JsonContent(
     *             type="object",
     *              @OA\Property(property="id", type="integer", example="1"),
     *                 @OA\Property(property="nom", type="string", example="Dupont"),
     *                 @OA\Property(property="prenom", type="string", example="Jean"),
     *                 @OA\Property(property="email", type="string", example="jean.dupont@example.com"),
     *                 @OA\Property(property="pseudo", type="string", example="jdupont"),
     *                 @OA\Property(property="verif_age", type="boolean", example="true"),
     *                 @OA\Property(property="derniere_activite", type="string", format="date-time", example="2025-01-07T00:00:00Z"),
     *                 @OA\Property(property="id_spr", type="integer", example="1"),
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => "required|string|email|max:255|unique:guide,email",
            'pseudo' => "required|string|max:255|unique:guide,pseudo",
            'mot_de_passe' => 'nullable|string|min:8',
            'verif_age' => 'required|boolean',
            'id_spr' => 'required|exists:spr,id',
            'derniere_activite' => 'nullable|date'
        ]);


        $guide = Guide::create($validated);
        return response()->json($guide, 201);
    }


}