<?php 

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Images;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;


/* ImagesController is a class that handles the CRUD operations for the Image model 
 * To be more specific, it handles the following operations:
 * 1. Fetch all images
 * 2. Fetch one image
 * 3. Store an image
 * 4. Update an image
 * 5. Delete an image
 */

/**
 * @OA\Tag(
 *    name="Images",
 *   description="Endpoints for images"
 * )
 */
class ImagesController extends Controller 
{
    /**
     * @OA\Get(
     *    path="/api/images",
     *    tags={"Images"},
     *    security={{"bearerAuth": {}}},
     *    summary="Fetch all images",
     *    @OA\Response(
     *        response=200,
     *        description="Success"
     *    )
     * )
     */
    public function index() 
    {
        return Images::all();
    }

    /**
     * @OA\Get(
     *     path="/api/images/{id}",
     *     tags={"Images"},
     *     summary="Get image by ID",
     *     description="Returns a single image",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of image",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="image_url", type="string"),
     *             @OA\Property(property="id_spr", type="integer")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Image not found"
     *     )
     * )
     */
    public function show(string $id) 
    {
        $image = Images::findOrFail($id);
    
        return response()->json([
            'data' => $image
        ], 200);

    
    }

    

    /**
     * @OA\Delete(
     *     path="/api/images/{id}",
     *     tags={"Images"},
     *     summary="Delete an image",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of image to delete",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="Image deleted successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Image not found"
     *     )
     * )
     */
    public function destroy(string $id) 
    {
        $image = Images::findOrFail($id);

        DB::transaction(function () use ($image) {
            $filePath = str_replace(Storage::url(''), '', $image->image_url); // Remove base URL to get relative path
            Storage::disk('public')->delete($filePath);
            $image->delete();
        });

        return response()->json(null, 204);
    }
}
