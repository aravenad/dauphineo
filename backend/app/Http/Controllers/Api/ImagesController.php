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
        return Images::paginate(10);
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
        return $image;
    }

    /**
     * @OA\Post(
     *     path="/api/images",
     *     tags={"Images"},
     *     summary="Create a new image record",
     *     description="Stores an image associated with a specific SPR. The image URL is dynamically generated and returned in the response.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"image", "id_spr"},
     *             @OA\Property(property="image", type="string", format="binary", description="Image file (JPEG, PNG, JPG) with a minimum resolution of 300x300 pixels."),
     *             @OA\Property(property="id_spr", type="integer", description="ID of the SPR to associate with the image.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Image created successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="id", type="integer", description="ID of the created image."),
     *             @OA\Property(property="image_url", type="string", description="Dynamically generated URL of the stored image."),
     *             @OA\Property(property="id_spr", type="integer", description="ID of the associated SPR.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="error", type="string", description="Details of the validation error.")
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        try {
            // Validate file presence and type
            $validated = $request->validate([
                'image' => 'required|file|image|mimes:jpeg,png,jpg|max:2048',
                'id_spr' => 'required|integer|exists:spr,id'
            ]);

            $file = $request->file('image');
            
            // Retrieve image metadata
            $imageInfo = getimagesize($file);
            if (!$imageInfo) {
                return response()->json(['error' => 'Invalid image file.'], 422);
            }

            // Validate metadata
            $width = $imageInfo[0];
            $height = $imageInfo[1];
            $minWidth = 300;
            $minHeight = 300;
            if ($width < $minWidth || $height < $minHeight) {
                return response()->json([
                    'error' => "Image resolution must be at least {$minWidth}x{$minHeight} pixels."
                ], 422);
            }

            // Store the file and get the URL
            $path = $file->store('images', 'public');
            $imageUrl = Storage::url($path); // Dynamically generate the URL

            // Save to database
            $image = Images::create([
                'image_url' => $imageUrl,
                'id_spr' => $validated['id_spr']
            ]);

            return response()->json($image, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Create image error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create image'], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/api/images/{id}",
     *     tags={"Images"},
     *     summary="Update an existing image",
     *     description="Updates the details of an existing image. Supports updating the file and/or the associated SPR. The image must meet the resolution and file type requirements.",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of the image to update.",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="image", type="string", format="binary", description="Image file (JPEG, PNG, JPG) with a minimum resolution of 300x300 pixels."),
     *             @OA\Property(property="id_spr", type="integer", description="ID of the SPR to associate with the image.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Image updated successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="id", type="integer", description="ID of the updated image."),
     *             @OA\Property(property="image_url", type="string", description="URL of the updated image."),
     *             @OA\Property(property="id_spr", type="integer", description="ID of the associated SPR.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="error", type="string", description="Details of the validation error.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Image not found",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="error", type="string", description="Error message when the image is not found.")
     *         )
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
        try {
            $image = Images::findOrFail($id);

            $validated = $request->validate([
                'image' => 'nullable|file|image|mimes:jpeg,png,jpg|max:2048',
                'id_spr' => 'nullable|integer|exists:spr,id'
            ]);

            if ($request->hasFile('image')) {
                $file = $request->file('image');

                // Retrieve image metadata
                $imageInfo = getimagesize($file);
                if (!$imageInfo) {
                    return response()->json(['error' => 'Invalid image file.'], 422);
                }

                // Validate metadata
                $width = $imageInfo[0];
                $height = $imageInfo[1];
                $minWidth = 300;
                $minHeight = 300;

                if ($width < $minWidth || $height < $minHeight) {
                    return response()->json([
                        'error' => "Image resolution must be at least {$minWidth}x{$minHeight} pixels."
                    ], 422);
                }

                // Delete old file
                $oldPath = str_replace('/storage/', '', $image->image_url);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }

                // Store new file
                $path = $file->store('images', 'public');
                $image->image_url = '/storage/' . $path;
            }

            if ($request->has('id_spr')) {
                $image->id_spr = $validated['id_spr'];
            }

            $image->save();

            return response()->json($image, 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Image not found'], 404);
        } catch (\Exception $e) {
            Log::error('Update image error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update image'], 500);
        }
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
