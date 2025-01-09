<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UtilisateurController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\ImagesController;
use App\Http\Controllers\Api\SprController;
use App\Http\Controllers\Api\GuideController;
use App\Http\Controllers\Api\AvisController;
use App\Http\Controllers\Api\CreneauxController;
use App\Http\Controllers\Api\DisponibilitesController;
use App\Http\Controllers\Api\VisiteController;
use App\Http\Controllers\Api\AuthController;

Route::get('/utilisateur', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Route::prefix('auth')->group(function() {
//  Route::post('/', [AuthController::class, 'register']);
    //Route::post('/', [AuthController::class, 'login']);
    //Route::post('/', [AuthController::class, 'logout']);
// });


// Routes de UtilisateurController
Route::prefix('utilisateur')->group(function() {
    Route::get('/', [UtilisateurController::class, 'index']);
    Route::get('{id}', [UtilisateurController::class, 'show']);
    Route::post('/', [UtilisateurController::class, 'store']);
    //Route::put('{id}', [UtilisateurController::class, 'update']);
    //Route::delete('{id}', [UtilisateurController::class, 'destroy']);
});

// Routes for ImagesController
Route::prefix('images')->group(function() {
    Route::get('/', [ImagesController::class, 'index']);
    Route::get('{id}', [ImagesController::class, 'show']);
    Route::post('/', [ImagesController::class, 'store']);
    Route::post('{id}', [ImagesController::class, 'update']);
    Route::delete('{id}', [ImagesController::class, 'destroy']);
});

// Routes for SprController
Route::prefix('spr')->group(function() {
    Route::get('/', [SprController::class, 'index']);
    Route::get('{id}', [SprController::class, 'show']);
});

// Routes for GuideController
Route::prefix('guides')->group(function() {
    Route::get('/', [GuideController::class, 'index']);
    Route::get('{id}', [GuideController::class, 'show']);
    Route::put('{id}', [GuideController::class, 'update']);
    Route::delete('{id}', [GuideController::class, 'destroy']);
});

// Routes for AvisController
Route::prefix('avis')->group(function() {
    Route::get('/', [AvisController::class, 'index']);
    Route::get('{id}', [AvisController::class, 'show']);
    Route::post('/', [AvisController::class, 'store']);
    Route::delete('{id}', [AvisController::class, 'destroy']);
});

// Routes for ReservationController
Route::prefix('reservations')->group(function() {
    Route::get('/', [ReservationController::class, 'index']);
    Route::post('/', [ReservationController::class, 'store']);
    Route::patch('{reservationId}', [ReservationController::class, 'updateStatus']);
});

// Routes de CreneauxController
Route::prefix('creneaux')->group(function() {
    Route::get('/{id_spr}', [CreneauxController::class, 'index']);
});

// Routes de DisponibilitesController
Route::prefix('disponibilites')->group(function() {  // Correction du préfixe
    Route::get('/', [DisponibilitesController::class, 'index']);
    Route::get('{id}', [DisponibilitesController::class, 'show']);
    Route::put('{id}', [DisponibilitesController::class, 'update']);
    Route::delete('{id}', [DisponibilitesController::class, 'destroy']);
});

// Routes for VisiteController
Route::prefix('visites')->group(function() {
    Route::get('/', [VisiteController::class, 'index']);
    Route::get('/{id}', [VisiteController::class, 'show']);
    Route::post('/', [VisiteController::class, 'store']);
    Route::delete('/{id}', [VisiteController::class, 'destroy']);
    Route::get('/user/{userId}', [VisiteController::class, 'getUserVisites']);
    Route::get('/spr/{sprId}', [VisiteController::class, 'getVisitesBySpr']);
    Route::get('/disponibilite/{disponibiliteId}', [VisiteController::class, 'getVisitesByDisponibilite']);
});
