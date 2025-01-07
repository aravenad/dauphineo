<?php

namespace App\Http\Controllers\Api;

use App\Models\Spr;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

/**
 * @OA\Info(
 *     title="SPR API",
 *     version="1.0.0",
 *     description="API endpoints for managing Sites du Patrimoine Remarquable"
 * )
 */
class SprController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/spr",
     *     summary="Get all SPR sites",
     *     @OA\Response(
     *         response=200,
     *         description="List of SPR sites"
     *     )
     * )
     */
    public function index()
    {
        return Spr::with(['images', 'guides', 'avis'])->get();
    }

    /**
     * @OA\Post(
     *     path="/api/spr",
     *     summary="Create a new SPR site",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"code_departement","nom_du_departement","nom_commune","capacite_de_visite"},
     *             @OA\Property(property="code_departement", type="string"),
     *             @OA\Property(property="nom_du_departement", type="string"),
     *             @OA\Property(property="nom_commune", type="string"),
     *             @OA\Property(property="capacite_de_visite", type="integer"),
     *             @OA\Property(property="mot_cle", type="string"),
     *             @OA\Property(property="is_pmr", type="boolean"),
     *             @OA\Property(property="temps_de_visite", type="integer")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="SPR created successfully"
     *     )
     * )
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code_departement' => 'required|string',
            'nom_du_departement' => 'required|string',
            'nom_commune' => 'required|string',
            'capacite_de_visite' => 'required|integer',
            'mot_cle' => 'nullable|string',
            'is_pmr' => 'boolean',
            'temps_de_visite' => 'nullable|integer'
        ]);

        $spr = Spr::create($validated);
        return response()->json($spr, 201);
    }

    /**
     * @OA\Get(
     *     path="/api/spr/{id}",
     *     summary="Get SPR site by ID",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="SPR site details"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="SPR site not found"
     *     )
     * )
     */
    public function show(string $id)
    {
        $spr = Spr::with(['images', 'guides', 'avis', 'visites'])->findOrFail($id);
        return response()->json($spr);
    }

    /**
     * @OA\Put(
     *     path="/api/spr/{id}",
     *     summary="Update SPR site",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             @OA\Property(property="code_departement", type="string"),
     *             @OA\Property(property="nom_du_departement", type="string"),
     *             @OA\Property(property="nom_commune", type="string"),
     *             @OA\Property(property="capacite_de_visite", type="integer"),
     *             @OA\Property(property="mot_cle", type="string"),
     *             @OA\Property(property="is_pmr", type="boolean"),
     *             @OA\Property(property="temps_de_visite", type="integer")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="SPR updated successfully"
     *     )
     * )
     */
    public function update(Request $request, string $id)
    {
        $spr = Spr::findOrFail($id);
        
        $validated = $request->validate([
            'code_departement' => 'string',
            'nom_du_departement' => 'string',
            'nom_commune' => 'string',
            'capacite_de_visite' => 'integer',
            'mot_cle' => 'nullable|string',
            'is_pmr' => 'boolean',
            'temps_de_visite' => 'nullable|integer'
        ]);

        $spr->update($validated);
        return response()->json($spr);
    }

    /**
     * @OA\Delete(
     *     path="/api/spr/{id}",
     *     summary="Delete SPR site",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="SPR deleted successfully"
     *     )
     * )
     */
    public function destroy(string $id)
    {
        $spr = Spr::findOrFail($id);
        $spr->delete();
        return response()->json(null, 204);
    }
}
