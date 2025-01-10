//<?php

// namespace App\Http\Controllers\Api;

// use Illuminate\Http\Request;
// use App\Models\Utilisateur;
// use App\Http\Controllers\Controller;
// use Laravel\Sanctum\PersonalAccessToken;


// /**
//  * @OA\Tag(
//  *     name="auth",
//  *     description="Endpoints for managing user connexions"
//  * )
//  */
// class AuthController extends Controller
// {

//     /**
//      * @OA\Post(
//      *     path="/api/auth/register",
//      *     tags={"auth"},
//      *     security={{"bearerAuth": {}}},
//      *     summary="User registration",
//      *     @OA\RequestBody(
//      *         required=true,
//      *         @OA\MediaType(
//      *             mediaType="application/json",
//      *             @OA\Schema(
//      *                 type="object",
//      *                 @OA\Property(property="nom", type="string", example="Doe"),
//      *                 @OA\Property(property="prenom", type="string", example="John"),
//      *                 @OA\Property(property="email", type="string", format="email", example="lilya.doe@example.com"),
//      *                 @OA\Property(property="mot_de_passe", type="string", example="securepassword123"),
//      *                 @OA\Property(property="pseudo", type="string", example="Jdu59"),
//      *                 @OA\Property(property="verif_age", type="string", example=true)
//      *             )
//      *         )
//      *     ),
//      *     @OA\Response(
//      *         response=201,
//      *         description="User registered successfully",
//      *         @OA\JsonContent(
//      *             type="object",
//      *             @OA\Property(property="nom", type="string", example="Doe"),
//      *             @OA\Property(property="prenom", type="string", example="John"),
//      *             @OA\Property(property="email", type="string", example="john.doe@example.com"),
//      *             @OA\Property(property="pseudo", type="string", example="Jdu59")
//      *         )
//      *     )
//      * )
//      */

//     public function register(Request $request)
//         {
//             $data=$request->validate([
//                 'nom' => 'required|string|max:50',
//                 'prenom' => 'required|string|max:50',
//                 'email' => 'required|string|email|max:255|unique:utilisateur',
//                 'mot_de_passe' => 'required|string|min:8',
//                 'pseudo' => 'required|string|max:50',
//                 'verif_age' => 'required|boolean'
//             ]);

//             $user = Utilisateur::create($data);

//             $token = $user->createToken('auth_token')->plainTextToken;

//             return response()->json([
//                 'access_token' => $token,
//                 'utilisateur' => $user,
//                 'token_type' => 'Bearer',
//             ], 201);
//         }

    // public function login(Request $request)
    //     {
    //         $data=$request->validate([
    //             'email' => 'required|string|email',
    //             'password' => 'required|string',
    //         ]);

    //         $user = User::where('email', $data->email)->first();

    //         if (! $user || ! Hash::check($data->password, $user->password)) {
    //             return response(['message' => 'Bad credentials'], 401);
    //         }

    //         $token = $user->createToken('auth_token')->plainTextToken;

    //         return response()->json([
    //              'access_token' => $token,
    //             'utilisateur' => $user,
    //              'token_type' => 'Bearer',
    //          ]);
    //     }

    // public function logout(Request $request)
    //     {
    //         if ($request->user()) {
    //             $request->user()->currentAccessToken()->delete();
    //             return response()->json(['message' => 'Déconnexion réussie']);
    //         }
    //         return response()->json(['message' => 'Aucun utilisateur connecté'], 401);
    //     }
//} 
