// <?php
//
// namespace App\Http\Controllers;
//
// use Illuminate\Http\Request;
// use App\Models\Utilisateur;
//
// // /**
// //  * @OA\Tag(
// //  *     name="auth",
// //  *     description="Endpoints for managing user connexions"
// //  * )
// //  */
// class AuthController extends Controller
// {
// //     /**
// //      * @OA\Post(
// //      *     path="/api/auth",
// //      *     tags={"auth"},
// //      *     security={{"bearerAuth": {}}},
// //      *     summary="Register a new user"
// //      * )
// //      */
// //
// //     public function register(Request $request)
// //         {
// //             $data=$request->validate([
// //                 'name' => 'required|string|max:50',
// //                 'prenom' => 'required|string|max:50',
// //                 'email' => 'required|string|email|max:255|unique:users',
// //                 'password' => 'required|string|min:8',
// //                 'pseudo' => 'required|string|max:50',
// //             ]);
// //
// //             $user = Utilisateur::create($data);
// //
// //             $token = $user->createToken('auth_token')->plainTextToken;
// //
// //             return [
// //                 'user' => $user,
// //                 'token' => $token
// //             ];
// //         }
//
// //     public function login(Request $request)
// //         {
// //             $data=$request->validate([
// //                 'email' => 'required|string|email',
// //                 'password' => 'required|string',
// //             ]);
// //
// //             $user = User::where('email', $data->email)->first();
// //
// //             if (! $user || ! Hash::check($data->password, $user->password)) {
// //                 return response(['message' => 'Bad credentials'], 401);
// //             }
// //
// //             $token = $user->createToken('auth_token')->plainTextToken;
// //
// //             return [
// //                 'user' => $user,
// //                 'token' => $token
// //             ];
// //         }
// //
// //     public function logout(Request $request)
// //         {
// //             if ($request->user()) {
// //                 $request->user()->currentAccessToken()->delete();
// //                 return response()->json(['message' => 'Déconnexion réussie']);
// //             }
// //             return response()->json(['message' => 'Aucun utilisateur connecté'], 401);
// //         }
// }
