<?php

namespace App\Http\Controllers\Api;

use App\Models\Spr;
use App\Models\Avis;
use App\Models\Images;
use App\Models\Guide;
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
        $spr = Spr::findOrFail($id);
        return $spr;
    }

     /**
     * @OA\Get(
     *     path="/api/spr/{id}/avis",
     *     tags={"SPR"},
     *     security={{"bearerAuth": {}}},
     *     summary="Fetch all reviews for a specific SPR",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example="1"),
     *                 @OA\Property(property="titre", type="string", example="Super visite"),
     *                 @OA\Property(property="commentaire", type="string", example="Très belle expérience, guide au top !"),
     *                 @OA\Property(property="note", type="integer", example="5"),
     *                 @OA\Property(property="date_de_publication", type="string", format="date-time", example="2025-01-07 09:06:47"),
     *                 @OA\Property(property="id_spr", type="integer", example="1"),
     *                 @OA\Property(property="utilisateur", type="object", example={"nom": "Dupont", "prenom": "Jean", "pseudo": "jean.dupont"}),
     *             ),
     *             
     *         )
     *     )
     * )
     */
    public function getAvisBySpr(string $id)
    {
        // On vérifie que le SPR existe
        Spr::findOrFail($id);

        // On récupère l'utilisateur qui a posté cet avis pour ce SPR
        $avis = Avis::with(['utilisateur:id,nom,prenom,pseudo'])
        ->where('id_spr', $id)
        ->get();

        return $avis;
    }

   /**
     * @OA\Get(
     *     path="/api/spr/{id}/images",
     *     tags={"SPR"},
     *     security={{"bearerAuth": {}}},
     *     summary="Fetch all images for a specific SPR",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example="1"),
     *                 @OA\Property(property="titre", type="string", example="Super visite"),
     *                 @OA\Property(property="commentaire", type="string", example="Très belle expérience, guide au top !"),
     *                 @OA\Property(property="note", type="integer", example="5"),
     *                 @OA\Property(property="date_de_publication", type="string", format="date-time", example="2025-01-07 09:06:47"),
     *                 @OA\Property(property="id_spr", type="integer", example="1"),
     *                 @OA\Property(property="images", type="object", example={"image_url": "http://localhost:8000/storage/images/1.jpg"}),
     *             ),
     *         )
     *     )
     * )
     */
    public function getImagesBySpr(string $id) {
        
        // On vérifie que le SPR existe
        Spr::findOrFail($id);

        // On récupère les images pour ce SPR
        $images = Images::where('id_spr', $id)->get();
        return $images;
    }
    
       /**
     * @OA\Get(
     *     path="/api/spr/{id}/guides",
     *     tags={"SPR"},
     *     security={{"bearerAuth": {}}},
     *     summary="Fetch all guides for a specific SPR",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example="1"),
     *                 @OA\Property(property="titre", type="string", example="Super visite"),
     *                 @OA\Property(property="commentaire", type="string", example="Très belle expérience, guide au top !"),
     *                 @OA\Property(property="note", type="integer", example="5"),
     *                 @OA\Property(property="date_de_publication", type="string", format="date-time", example="2025-01-07 09:06:47"),
     *                 @OA\Property(property="id_spr", type="integer", example="1"),
     *                 @OA\Property(property="guides", type="object", example={"image_url": "http://localhost:8000/storage/images/1.jpg"}),
     *             ),
     *         )
     *     )
     * )
     */
    public function getGuidesBySpr(string $id) {
        
        Spr::findOrFail($id);

        $guides= Guide::where('id_spr', $id)->get();

        return $guides;
    }
}