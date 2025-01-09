<?php

namespace App\Http\Controllers\Api;

use App\Models\Utilisateur;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

/**
 * @OA\Tag(
 *     name="utilisateur",
 *     description="Endpoints for managing users"
 * )
 */
class UtilisateurController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/utilisateur",
     *     tags={"utilisateur"},
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
        $users = Utilisateur::all();
        return $users;
    }

    /**
     * @OA\Post(
     *     path="/api/utilisateur",
     *     tags={"utilisateur"},
     *     security={{"bearerAuth": {}}},
     *     summary="Create a new user",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Property(property="nom", type="string", example="Dupont"),
     *                 @OA\Property(property="prenom", type="string", example="Jean"),
     *                 @OA\Property(property="email", type="string", format="email", example="jean.dupont@example.com"),
     *                 @OA\Property(property="mot_de_passe", type="string", format="password", example="securepassword123"),
     *                 @OA\Property(property="pseudo", type="string", example="Jdu59"),
     *                 @OA\Property(property="verif_age", type="boolean", example="true")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="User created successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="nom", type="string", example="Dupont"),
     *             @OA\Property(property="prenom", type="string", example="Jean"),
     *             @OA\Property(property="email", type="string", example="jean.dupont@example.com"),
     *             @OA\Property(property="pseudo", type="string", example="Jdu59"),
     *             @OA\Property(property="verif_age", type="boolean", example="true"),
     *             @OA\Property(property="derniere_activite", type="string", format="date-time", example="2025-01-01T12:00:00Z")
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string|max:50',
            'prenom' => 'required|string|max:50',
            'email' => 'required|string|email|max:255|unique:utilisateur',
            'mot_de_passe' => 'required|string|min:8',
            'pseudo' => 'required|string|max:50',
            'verif_age' => 'required|boolean'
        ]);

        $user = Utilisateur::create([
            'nom' => $request['nom'],
            'prenom' => $request['prenom'],
            'email' => $request['email'],
            'pseudo' => $request['pseudo'],
            'verif_age' => $request['verif_age'],
            'mot_de_passe' => bcrypt($request['mot_de_passe'])
        ]);

        return $user;
    }


 /**
      * @OA\Get(
      *     path="/api/utilisateur/{id}",
      *     tags={"utilisateur"},
      *     security={{"bearerAuth": {}}},
      *     summary="Get specific user details",
      *     @OA\Parameter(
      *         name="id",
      *         in="path",
      *         required=true,
      *         @OA\Schema(type="integer")
      *     ),
      *     @OA\Response(
      *         response=200,
      *         description="Utilisateur details"
      *     ),
      *     @OA\Response(
      *         response=404,
      *         description="Utilisateur not found"
      *     )
      * )
      */
    public function show($id)
    {
        $user = Utilisateur::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        return response()->json($user);
    }

    // Les autres méthodes comme update() et destroy() suivent la même logique pour correspondre au schéma.
}
