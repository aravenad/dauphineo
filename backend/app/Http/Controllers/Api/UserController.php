<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

/**
 * @OA\Tag(
 *     name="Users",
 *     description="API Endpoints for user management"
 * )
 */
class UserController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/users",
     *     tags={"Users"},
     *     security={{"bearerAuth": {}}},
     *     summary="Fetch all users",
     *     @OA\Response(
     *         response=200,
     *         description="Success"
     *     )
     * )
     */
    public function index()
    {
        $users = User::all();
        return $users;
    }

    /**
     * @OA\Post(
     *     path="/api/users",
     *     tags={"Users"},
     *     security={{"bearerAuth": {}}},
     *     summary="Create a new user",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"nom","prenom","email","pseudo","mot_de_passe"},
     *             @OA\Property(property="nom", type="string", example="Doe"),
     *             @OA\Property(property="prenom", type="string", example="John"),
     *             @OA\Property(property="email", type="string", format="email", example="john.doe@example.com"),
     *             @OA\Property(property="pseudo", type="string", example="johndoe"),
     *             @OA\Property(property="mot_de_passe", type="string", format="password", example="securepassword123"),
     *             @OA\Property(property="verif_age", type="boolean", example=true),
     *             @OA\Property(property="derniere_activite", type="string", format="date-time")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="User created successfully"
     *     )
     * )
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'pseudo' => 'required|string|max:255|unique:users',
            'mot_de_passe' => 'required|string|min:8',
            'verif_age' => 'boolean',
            'derniere_activite' => 'nullable|date'
        ]);

        $user = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'pseudo' => $request->pseudo,
            'mot_de_passe' => bcrypt($request->mot_de_passe),
            'verif_age' => $request->verif_age ?? false,
            'derniere_activite' => $request->derniere_activite ?? now()
        ]);

        return response()->json($user, 201);
    }

    /**
     * @OA\Get(
     *     path="/api/users/{userId}",
     *     tags={"Users"},
     *     security={{"bearerAuth": {}}},
     *     summary="Show one user",
     *     @OA\Parameter(
     *       name="userId",
     *       in="path",
     *       required=true,
     *       @OA\Schema(
     *         type="integer",
     *          minimum=1
     *        ),
     *     ),
     *       @OA\Response(
     *         response=200,
     *         description="User updated successfully",
     *         @OA\JsonContent(
     *             type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="John Doe"),
     *                 @OA\Property(property="email", type="string", example="john.doe@example.com")
     *         )
     *     ),
     *     @OA\Response(
     *       response=404,
     *       description="User not found",
     *        @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="User not found")
     *         )
     *     )
     * )
     */
    public function show($userId)
    {
        try {
            // Utilisation de findOrFail pour rechercher l'utilisateur par ID
            $user = User::findOrFail($userId);

            // Si l'utilisateur est trouvé, il est retourné sous forme de réponse JSON
            return response()->json($user, 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // Si l'utilisateur n'est pas trouvé, Laravel retourne automatiquement une réponse 404
            return response()->json(['message' => 'User not found'], 404);
        }
    }

    /**
     * @OA\Put(
     *     path="/api/users/{userId}",
     *     tags={"Users"},
     *     security={{"bearerAuth": {}}},
     *     summary="Update user",
     *     @OA\Parameter(
     *         name="userId",
     *         in="path",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             minimum=1
     *         )
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="nom", type="string"),
     *             @OA\Property(property="prenom", type="string"),
     *             @OA\Property(property="email", type="string", format="email"),
     *             @OA\Property(property="pseudo", type="string"),
     *             @OA\Property(property="mot_de_passe", type="string", format="password"),
     *             @OA\Property(property="verif_age", type="boolean"),
     *             @OA\Property(property="derniere_activite", type="string", format="date-time")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User updated successfully"
     *     )
     * )
     */
    public function update(Request $request, $userId)
    {
        $user = User::findOrFail($userId);

        $request->validate([
            'nom' => 'string|max:255',
            'prenom' => 'string|max:255',
            'email' => 'string|email|max:255|unique:users,email,' . $userId,
            'pseudo' => 'string|max:255|unique:users,pseudo,' . $userId,
            'mot_de_passe' => 'nullable|string|min:8',
            'verif_age' => 'boolean',
            'derniere_activite' => 'nullable|date'
        ]);

        if ($request->has('mot_de_passe')) {
            $request->merge(['mot_de_passe' => bcrypt($request->mot_de_passe)]);
        }

        $user->update($request->all());
        return response()->json($user);
    }

    /**
     * @OA\Delete(
     *     path="/api/users/{userId}",
     *     tags={"Users"},
     *     security={{"bearerAuth": {}}},
     *     summary="Delete one user",
     *     @OA\Parameter(
     *       name="userId",
     *       in="path",
     *       required=true,
     *       @OA\Schema(
     *         type="integer",
     *          minimum=1
     *        ),
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User deleted successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="User found")
     *         )
     *     ),
     *     @OA\Response(
     *       response=404,
     *       description="User not found",
     *        @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="User not found")
     *         )
     *     )
     * )
     */
    public function destroy($userId)
    {
        $user = User::find($userId);

        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur non trouvé'
            ], 404);
        }

        $user->delete();

        return response()->json([
            'message' => 'Utilisateur supprimé avec succès'
        ], 200);
    }
}
