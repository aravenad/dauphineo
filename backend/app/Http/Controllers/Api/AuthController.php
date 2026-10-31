<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use App\Notifications\CompteExistant;
use App\Notifications\ConfirmationInscription;
use Carbon\Carbon;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

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

    /** Durée de validité du lien d'activation envoyé à l'inscription. */
    private const DUREE_LIEN_HEURES = 24;

    /** Au-delà, les demandes pour une même adresse n'envoient plus d'e-mail pendant une heure. */
    private const EMAILS_PAR_HEURE = 3;

    /** Même réponse que l'adresse ait déjà un compte ou non, pour ne pas révéler qui est inscrit. */
    private const MESSAGE_INSCRIPTION = 'Si cette adresse peut être utilisée, un e-mail vient d\'y être envoyé. Ouvrez le lien qu\'il contient pour activer votre compte.';

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
            return response()->json(['message' => __('Adresse e-mail ou mot de passe incorrect.')], 401);
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
     *     summary="Ask for an account: emails an activation link, or a notice if the address already has an account",
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
     *     @OA\Response(response=202, description="Same neutral message whether or not the address is already registered"),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
    public function register(Request $request)
    {
        $data = $request->validate([
            'nom' => ['required', 'string', 'max:50', 'regex:'.Utilisateur::REGLE_NOM],
            'prenom' => ['required', 'string', 'max:50', 'regex:'.Utilisateur::REGLE_NOM],
            'email' => 'required|string|email|max:255',
            'mot_de_passe' => ['required', 'string', Password::defaults()],
            'verif_age' => 'required|accepted',
        ]);

        // Hachage fait dans les deux cas, pour que le temps de réponse ne trahisse pas un compte existant
        $empreinte = Hash::make($data['mot_de_passe']);
        $frontend = rtrim(config('app.frontend_url'), '/');

        RateLimiter::attempt('inscription:'.sha1(Str::lower($data['email'])), self::EMAILS_PAR_HEURE, function () use ($data, $empreinte, $frontend) {
            $existant = Utilisateur::where('email', $data['email'])->first();
            if ($existant) {
                $existant->notify(new CompteExistant($frontend.'/'));

                return;
            }

            // Rien n'est enregistré avant l'activation : le lien porte la demande, chiffrée avec la clé de l'application
            $jeton = Crypt::encryptString(json_encode([
                'nom' => $data['nom'],
                'prenom' => $data['prenom'],
                'email' => $data['email'],
                'mot_de_passe' => $empreinte,
                'expire' => Carbon::now()->addHours(self::DUREE_LIEN_HEURES)->getTimestamp(),
            ]));
            Notification::route('mail', $data['email'])
                ->notify(new ConfirmationInscription($frontend.'/?inscription='.rawurlencode($jeton)));
        }, 3600);

        return response()->json(['message' => __(self::MESSAGE_INSCRIPTION)], 202);
    }

    /**
     * @OA\Post(
     *     path="/api/auth/confirmer",
     *     tags={"auth"},
     *     summary="Create the account from the activation link sent by email",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(@OA\Property(property="jeton", type="string"))
     *     ),
     *     @OA\Response(response=201, description="Account created, returns the user and a bearer token"),
     *     @OA\Response(response=409, description="The account is already active"),
     *     @OA\Response(response=422, description="Invalid or expired link")
     * )
     */
    public function confirmer(Request $request)
    {
        $request->validate(['jeton' => 'required|string']);

        try {
            $inscription = json_decode(Crypt::decryptString((string) $request->input('jeton')), true, flags: JSON_THROW_ON_ERROR);
        } catch (DecryptException|\JsonException) {
            return response()->json(['message' => __('Ce lien d\'activation n\'est pas valide. Vérifiez qu\'il a été copié en entier.')], 422);
        }

        if ($inscription['expire'] < Carbon::now()->getTimestamp()) {
            return response()->json(['message' => __('Ce lien d\'activation a expiré. Inscrivez-vous de nouveau pour en recevoir un autre.')], 422);
        }

        $dejaActif = response()->json(['message' => __('Ce compte est déjà activé. Connectez-vous avec votre adresse e-mail et votre mot de passe.')], 409);
        if (Utilisateur::where('email', $inscription['email'])->exists()) {
            return $dejaActif;
        }

        try {
            $user = Utilisateur::create([
                'nom' => $inscription['nom'],
                'prenom' => $inscription['prenom'],
                'email' => $inscription['email'],
                'mot_de_passe' => $inscription['mot_de_passe'],
                'verif_age' => true,
                'pseudo' => $this->generatePseudo($inscription['prenom']),
                'derniere_activite' => Carbon::now(),
            ]);
        } catch (UniqueConstraintViolationException) {
            // Le même lien ouvert deux fois en même temps
            return $dejaActif;
        }

        return $this->reponseConnexion($user, 201);
    }
}
