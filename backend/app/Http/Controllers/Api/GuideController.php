<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Guide;
use Carbon\Carbon;

/**
 * @OA\Tag(
 *     name="guide",
 *     description="Endpoints for reading guide profiles"
 * )
 */
class GuideController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/guides/{id}",
     *     tags={"guide"},
     *     summary="Get a guide and the SPR they lead visits on",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Success"),
     *     @OA\Response(response=404, description="Guide not found")
     * )
     */
    public function show(string $id)
    {
        return Guide::with('spr:id,nom_commune')->findOrFail($id);
    }

    /**
     * @OA\Get(
     *     path="/api/guides/{id}/disponibilites",
     *     tags={"guide"},
     *     summary="List the upcoming availabilities of a guide with their slot and remaining places",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Success"),
     *     @OA\Response(response=404, description="Guide not found")
     * )
     */
    public function disponibilitesGuide(string $id)
    {
        $guide = Guide::findOrFail($id);

        $disponibilites = $guide->disponibilites()
            ->with(['creneaux', 'visite'])
            ->where('date_jour', '>=', Carbon::today())
            ->orderBy('date_jour')
            ->get();

        return response()->json([
            'guide' => $guide->only(['id', 'nom', 'prenom']),
            'disponibilites' => $disponibilites,
        ]);
    }
}
