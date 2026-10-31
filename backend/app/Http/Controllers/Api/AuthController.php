<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

/**
 * @OA\Tag(
 *     name="auth",
 *     description="Endpoints for authentication"
 * )
 */
class AuthController extends Controller
{
    /** Durée de validité d'un jeton d'accès. */
    private const DUREE_JETON_HEURES = 3;

    /**
     * Génère un pseudo libre à partir du prénom, par exemple « claire_4821 ».
     */
    private function generatePseudo(string $prenom): string
    {
        $base = Str::of($prenom)->ascii()->lower()->replaceMatches('/[^a-z0-9]/', '')->limit(20, '');
        $base = $base->isEmpty() ? 'user' : (string) $base;

        do {
            $pseudo = $base.'_'.random_int(1000, 9999);
        } while (Utilisateur::where('pseudo', $pseudo)->exists());

        return $pseudo;
    }

    private function reponseConnexion(Utilisateur $user, int $status = 200)
    {
        $token = $user->createToken('auth_token', ['*'], Carbon::now()->addHours(self::DUREE_JETON_HEURES))->plainTextToken;

        return response()->json([
            'user' => $user,
            'access_token' => $token,
        ], $status);
    }

    /**
     * @OA\Post(
     *     path="/api/auth/login",
     *     tags={"auth"},
     *     summary="User login",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="email", type="string", example="demo@dauphineo.test"),
     *             @OA\Property(property="password", type="string"),
     *         )
     *     ),
     *     @OA\Response(response=200, description="User authenticated, returns the user and a bearer token"),
     *     @OA\Response(response=401, description="Invalid credentials")
     * )
     */
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (! Auth::attempt($data)) {
            return response()->json(['message' => 'Adresse e-mail ou mot de passe incorrect.'], 401);
        }

        /** @var Utilisateur $user */
        $user = Auth::user();
        $user->forceFill(['derniere_activite' => Carbon::now()])->save();

        return $this->reponseConnexion($user);
    }

    /**
     * @OA\Post(
     *     path="/api/auth/register",
     *     tags={"auth"},
     *     summary="Register a new user",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="nom", type="string", example="Doe"),
     *             @OA\Property(property="prenom", type="string", example="John"),
     *             @OA\Property(property="email", type="string", example="john.doe@example.com"),
     *             @OA\Property(property="mot_de_passe", type="string", minLength=8),
     *             @OA\Property(property="verif_age", type="boolean", example=true),
     *         )
     *     ),
     *     @OA\Response(response=201, description="User registered, returns the user and a bearer token"),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
    public function register(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string|max:50',
            'prenom' => 'required|string|max:50',
            'email' => 'required|string|email|max:255|unique:utilisateur,email',
            'mot_de_passe' => 'required|string|min:8',
            'verif_age' => 'required|accepted',
        ]);

        $user = Utilisateur::create([
            ...$data,
            'verif_age' => true,
            'pseudo' => $this->generatePseudo($data['prenom']),
            'derniere_activite' => Carbon::now(),
        ]);

        return $this->reponseConnexion($user, 201);
    }
}
