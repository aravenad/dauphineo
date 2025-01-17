<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\Utilisateur;
use Carbon\Carbon;

/**
 * @OA\Tag(
 *     name="auth",
 *     description="Endpoints for authentication"
 * )
 */
class AuthController extends Controller
{
    /**
     * Method to generate a unique pseudo based on User's name and firstname
     * @author nael
     * @return string
     */
    private function generatePseudo()
    {

        $base = "user_";

        // Remove accents and special characters
        $base = preg_replace('/[^A-Za-z0-9]/', '', $base);

        $pseudo = $base . substr(uniqid(), 0, 4);


        return $pseudo;
    }

    /**
     * @OA\Post(
     *     path="/api/auth/login",
     *     tags={"auth"},
     *     summary="User login",
     *     @OA\RequestBody(
     *         required=true,
     *          @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Property(property="email", type="string", example="john.doe@example.com"),
     *                 @OA\Property(property="password", type="string", example="securepassword123"),
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User authenticated",
     *           @OA\JsonContent(
     *             type="object",
     *              @OA\Property(property="status", type="integer", example="1"),
     *                 @OA\Property(property="user", type="string", example="..."),
     *                 @OA\Property(property="access_token", type="string", example="..."),
     *         )
     *     )
     * )
     */
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (Auth::attempt($data)) {
            /** @var \App\Models\Utilisateur $user **/
            $user = Auth::user();
            $token = $user->createToken('auth_token', ['*'], Carbon::now()->addHours(3))->plainTextToken;

            return response()->json([
                'status' => 1,
                'user' => $user,
                'access_token' => $token
            ]);
        }
        return [
            'statut' => 0,
            'user' => null,
        ];
    }

    /**
     * @OA\Post(
     *     path="/api/auth/register",
     *     tags={"auth"},
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

        $token = $user->createToken('auth_token', ['*'], Carbon::now()->addHours(3))->plainTextToken;


        return response()->json([
            'message' => 'User registered successfully',
            'utilisateur' => $user,
            'access_token' => $token,
        ], 201);
    }
}
