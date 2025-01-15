<?php

namespace App\Http\Controllers\Api;

use App\Models\Utilisateur;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;


/**
 * @OA\Tag(
 *     name="utilisateur",
 *     description="Endpoints for utilisateur"
 * )
 */
class UtilisateurController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/utilisateur/login",
     *     tags={"utilisateur"},
     *     security={{"bearerAuth": {}}},
     *     summary="User login",
     *     @OA\RequestBody(
     *         required=true,
     *          @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Property(property="email", type="string", example="john.doe@gmail.com"),
     *                 @OA\Property(property="mot_de_passe", type="string", example="securepassword123"),
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User authenticated",
     *           @OA\JsonContent(
     *             type="object",
     *              @OA\Property(property="message", type="string", example="Login successful"),
     *                 @OA\Property(property="utilisateur", type="string", example="..."),
     *                 @OA\Property(property="token", type="string", example="..."),
     *         )
     *     )
     * )
     */
    public function login(Request $request) {
        $data=$request->validate([
            'email' => 'required|email',
            'mot_de_passe' => 'required'
        ]);

        $user = Utilisateur::where('email', $request['email'])->firstOrFail();
        
        if (! $user || ! Hash::check($data['mot_de_passe'], $user->mot_de_passe)) {
            return response(['message' => 'Bad credentials'], 401);
        }
        if($user->tokens()->where('tokenable_id', $user->id)->exists()) {
            $user->tokens()->delete();
        }
        $user->derniere_activite = Carbon::now();
        $user->save(); // Sauvegarde les modifications 
        $expiration = Carbon::now()->addMinutes(60);

        $token = $user->createToken('auth_token')->plainTextToken;

        $accessToken = $user->tokens()->latest()->first();
        $accessToken->expires_at = $expiration;
        $accessToken->save();

        return response()->json([
            'message' => 'Login successful',
            'utilisateur' => $user,
            'token' => $token
        ]);

    }

    /**
     * Method to generate a unique pseudo based on User's name and firstname
     * @author nael
     * @return string
     */
    private function generatePseudo()
{

    $base = "user_";
    $randomNumbers = rand(100, 999);
    
    // Remove accents and special characters
    $base = preg_replace('/[^A-Za-z0-9]/', '', $base);
    
    $pseudo = $base . $randomNumbers;
    
    
    return $pseudo;
}

    /**
     * @OA\Post(
     *     path="/api/utilisateur/register",
     *     tags={"utilisateur"},
     *     security={{"bearerAuth": {}}},
     *     summary="User registration",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Property(property="nom", type="string", example="Doe"),
     *                 @OA\Property(property="prenom", type="string", example="John"),
     *                 @OA\Property(property="email", type="string", format="email", example="lilya.doe@example.com"),
     *                 @OA\Property(property="mot_de_passe", type="string", example="securepassword123"),
     *                 @OA\Property(property="verif_age", type="string", example=true)
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="User registered successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="nom", type="string", example="Doe"),
     *             @OA\Property(property="prenom", type="string", example="John"),
     *             @OA\Property(property="email", type="string", example="john.doe@example.com"),
     *             @OA\Property(property="pseudo", type="string", example="Jdu59"),
     *             @OA\Property(property="token", type="string", example="..."),
     *         )
     *     )
     * )
     */

    public function register(Request $request)
        {
            $data = $request->validate([
                'nom' => 'required|string|max:50',
                'prenom' => 'required|string|max:50',
                'email' => 'required|string|email|max:255|unique:utilisateur',
                'mot_de_passe' => 'required|string',
                'verif_age' => 'required|boolean'
            ]);



            $data['pseudo'] = $this->generatePseudo();


            $user = Utilisateur::create($data);
            $user->derniere_activite = Carbon::now();


            $expiration = Carbon::now()->addMinutes(60);
            $token = $user->createToken('auth_token')->plainTextToken;

            $accessToken = $user->tokens()->latest()->first();
            $accessToken->expires_at = $expiration;
            $accessToken->save();


            return response()->json([
                'token' => $token,
                'utilisateur' => $user,
            ]);
        }

     /**
     * @OA\Get(
     *     path="/api/utilisateur/{id}",
     *     tags={"utilisateur"},
     *     security={{"bearerAuth": {}}},
     *     summary="Show one user",
     *     @OA\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       @OA\Schema(
     *         type="integer",
     *          minimum=1
     *        ),
     *     ),
     *       @OA\Response(
     *         response=200,
     *         description="User found",
     *         @OA\JsonContent(
     *             type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="nom", type="string", example="Doe"),
     *                 @OA\Property(property="prenom", type="string", example="John"),
     *                 @OA\Property(property="email", type="string", example="john.doe@example.com"),
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
    public function show($id)
    {
        try {
            // Utilisation de findOrFail pour rechercher l'utilisateur par ID
            $user = Utilisateur::findOrFail($id);

            // Si l'utilisateur est trouvé, il est retourné sous forme de réponse JSON
            return response()->json($user, 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // Si l'utilisateur n'est pas trouvé, Laravel retourne automatiquement une réponse 404
            return response()->json(['message' => 'User not found'], 404);
        }
    }

    /**
     * @OA\Put(
     *     path="/api/utilisateur/{id}",
     *     tags={"utilisateur"},
     *     security={{"bearerAuth": {}}},
     *     summary="Update user",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             minimum=1
     *         )
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Property(property="nom", type="string", example="Doe"),
     *                 @OA\Property(property="prenom", type="string", example="John"),
     *                 @OA\Property(property="pseudo", type="string", example="john.doe"),
     *                 @OA\Property(property="email", type="string", example="john.doe@gmail.com"),
     *                 @OA\Property(property="mot_de_passe", type="string", example="securepassword123"),
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="User updated successfully",
     *         @OA\JsonContent(
     *             type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="prenom", type="string", example="John"),
     *                 @OA\Property(property="pseudo", type="string", example="john.doe"),
     *                 @OA\Property(property="email", type="string", example="john.doe@gmail.com")
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
    public function update(Request $request, $id)
    {

        $user = Utilisateur::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur non trouvé'
            ]);
        }

        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'pseudo' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'mot_de_passe' => 'nullable|string'
        ]);

        $user->update($request->all());
        return response()->json([
            'message' => 'Utilisateur mis à jour avec succès',
            'user' => $user,
        ]);
    
    }

    /**
     * @OA\Delete(
     *     path="/api/utilisateur/{id}",
     *     security={{"bearerAuth": {}}},
     *     tags={"utilisateur"},
     *     summary="Delete one user",
     *     @OA\Parameter(
     *       name="id",
     *       in="path",
     *       required=true,
     *       @OA\Schema(
     *         type="integer",
     *          minimum=1
     *        ),
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="User deleted successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="User deleted")
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
    public function destroy($id)
    {
        $user = Utilisateur::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur non trouvé'
            ], 404);
        }
        DB::table('personal_access_tokens')->where('tokenable_id', $user->id)->delete();
        //$token = $user->currentAccessToken();

        // if ($token) {
        //     // Supprimer le token actif
        //     $token->delete();
        // }
        $user->delete();

        return response()->json([
            'message' => 'Utilisateur supprimé avec succès'
        ], 200);
    }
    /**
    * @OA\Post(
    *     path="/api/utilisateur/logout",
    *     tags={"utilisateur"},
    *     security={{"bearerAuth": {}}},
    *     summary="User logout",
    *     @OA\Response(
    *         response=200,
    *         description="User logged out",
    *         @OA\JsonContent(
    *             type="object",
    *             @OA\Property(property="message", type="string", example="Déconnexion réussie")
    *         )
    *     ),
    *     @OA\Response(
    *         response=401,
    *         description="No user logged in",
    *         @OA\JsonContent(
    *             type="object",
    *             @OA\Property(property="message", type="string", example="Aucun utilisateur connecté")
    *         )
    *     )
    * )
    */
    public function logout(Request $request)
    {
        $user = $request->user();  // Récupère l'utilisateur authentifié

        if ($user) {
            // Mettre à jour la dernière activité de l'utilisateur (optionnel)
            $user->derniere_activite = Carbon::now();
            $user->save();
    
            // Supprimer le token actuel de l'utilisateur
            DB::table('personal_access_tokens')->where('tokenable_id', $user->id)->delete();
            //$user->currentAccessToken()->delete();
    
            return response()->json(['message' => 'Déconnexion réussie']);
        }
    
        return response()->json(['message' => 'Aucun utilisateur connecté'], 401);
    }
}


