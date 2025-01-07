<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Images;
use App\Models\Spr;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Response;

/**
 * @OA\Tag(
 *     name="Images",
 *     description="API Endpoints for Images management"
 * )
 */
class ImagesController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/images",
     *     tags={"Images"},
     *     security={{"bearerAuth": {}}},
     *     summary="Fetch all images",
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(type="array", @OA\Items(
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="image_url", type="string"),
     *             @OA\Property(property="id_spr", type="integer")
     *         ))
     *     )
     * )
     */
    public function index()
    {
        $images = Images::with('spr')->get();
        return response()->json($images);
    }

    /**
     * @OA\Post(
     *     path="/api/images",
     *     tags={"Images"},
     *     security={{"bearerAuth": {}}},
     *     summary="Upload a new image",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Property(property="image", type="file", format="binary"),
     *                 @OA\Property(property="id_spr", type="integer")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Image uploaded successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="image_url", type="string"),
     *             @OA\Property(property="id_spr", type="integer")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid input"
     *     )
     * )
     */
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'id_spr' => 'required|exists:spr,id'
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $path = $image->store('public/images');
            $url = Storage::url($path);

            $image = Images::create([
                'image_url' => $url,
                'id_spr' => $request->id_spr
            ]);

            return response()->json($image, 201);
        }

        return response()->json(['error' => 'No image provided'], 400);
    }

    /**
     * @OA\Get(
     *     path="/api/images/{id}",
     *     tags={"Images"},
     *     security={{"bearerAuth": {}}},
     *     summary="Get specific image",
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
        $image = Images::with('spr')->findOrFail($id);
        return response()->json($image);
    }

    /**
     * @OA\Post(
     *     path="/api/images/{id}",
     *     tags={"Images"},
     *     security={{"bearerAuth": {}}},
     *     summary="Update an image",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Property(property="image", type="file", format="binary"),
     *                 @OA\Property(property="id_spr", type="integer")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Image updated successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Image not found"
     *     )
     * )
     */
    public function update(Request $request, string $id)
    {
        $image = Images::findOrFail($id);

        $request->validate([
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'id_spr' => 'nullable|exists:spr,id'
        ]);

        if ($request->hasFile('image')) {
            // Delete old image
            Storage::delete(str_replace('/storage', 'public', $image->image_url));
            
            // Store new image
            $newImage = $request->file('image');
            $path = $newImage->store('public/images');
            $url = Storage::url($path);
            
            $image->image_url = $url;
        }

        if ($request->has('id_spr')) {
            $image->id_spr = $request->id_spr;
        }

        $image->save();
        return response()->json($image);
    }

    /**
     * @OA\Delete(
     *     path="/api/images/{id}",
     *     tags={"Images"},
     *     security={{"bearerAuth": {}}},
     *     summary="Delete an image",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
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
        
        // Delete the file from storage
        Storage::delete(str_replace('/storage', 'public', $image->image_url));
        
        $image->delete();
        return response()->json(null, 204);
    }
}
