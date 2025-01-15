<?php

namespace App\Http\Controllers\Api;

use App\Models\Spr;
use App\Models\Avis;
use App\Models\Images;
use App\Models\Guide;
use App\Services\AvisService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

/**
 * @OA\Tag(
 *     name="SPR",
 *     description="Endpoints for spr"
 * )
 */
class SprController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/spr",
     *     tags={"SPR"},
     *     security={{"bearerAuth": {}}},
     *     summary="Fetch all SPR",
     *     @OA\Response(
     *         response=200,
     *         description="Success"
     *     )
     * )
     */
    public function index()
    {
        return Spr::all();
    }

    /**
     * @OA\Get(
     *     path="/api/spr/{id}",
     *     tags={"SPR"},
     *     security={{"bearerAuth": {}}},
     *     summary="Show one SPR",
     *     @OA\Parameter(
     *         name="id",
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
    public function show(string $id)
    {
        // Pour un seul SPR, on envoie les images du SPR, les creneaux auxquels sont disponibles les guides et les avis du SPR
        $spr = Spr::with(['images', 'guides.disponibilites.creneaux', 'avis'])->findOrFail($id);
        $repartitionNotes = AvisService::getNotesMoyennes($spr->id);
        return response()->json([
            'spr' => $spr,
            'moyenne_notes' => $repartitionNotes
        ]);
    }
}