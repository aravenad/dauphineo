<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UtilisateurController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\SprController;
use App\Http\Controllers\Api\GuideController;
use App\Http\Controllers\Api\AvisController;
use App\Http\Controllers\Api\CreneauxController;
use App\Http\Controllers\Api\DisponibilitesController;
use App\Http\Controllers\Api\VisiteController;

// Protect routes with sanctum middleware
Route::middleware('auth:sanctum')->group(function () {

    // Routes for UtilisateurController
    Route::prefix('utilisateur')->group(function () {
        Route::get('/', [UtilisateurController::class, 'show']);
        Route::put('/', [UtilisateurController::class, 'update']);
        Route::delete('/', [UtilisateurController::class, 'destroy']);
        Route::post('/logout', [UtilisateurController::class, 'logout']);
        Route::get('/visites', [UtilisateurController::class, 'getUserVisites']);
        Route::get('/reservations', [UtilisateurController::class, 'getUserReservations']);
    });

    // Routes for GuideController
    Route::prefix('guides')->group(function () {
        Route::get('{id}', [GuideController::class, 'show']);
        Route::put('{id}', [GuideController::class, 'update']);
        Route::delete('{id}', [GuideController::class, 'destroy']);
        Route::post('/', [GuideController::class, 'store']);

        // Get guide disponibilites route
        Route::get('/{id}/disponibilites', [GuideController::class, 'disponibilitesGuide']);
    });

    // Routes for AvisController
    Route::prefix('avis')->group(function () {
        Route::get('{id}', [AvisController::class, 'show']);
        Route::post('/', [AvisController::class, 'store']);
        Route::delete('{id}', [AvisController::class, 'destroy']);
    });

    // Routes for ReservationController
    Route::prefix('reservations')->group(function () {
        Route::post('/', [ReservationController::class, 'store']);
    });

    // Routes for DisponibilitesController
    Route::prefix('disponibilites')->group(function () {
        Route::get('{id_guide}/{id_spr}', [DisponibilitesController::class, 'index']);
        Route::post('/', [DisponibilitesController::class, 'store']);
        Route::delete('{id}', [DisponibilitesController::class, 'destroy']);
    });

    // Routes for VisiteController
    Route::prefix('visites')->group(function () {
        Route::get('/{id}', [VisiteController::class, 'show']);
        Route::post('/', [VisiteController::class, 'store']);
        Route::delete('/{id}', [VisiteController::class, 'destroy']);
        // Route::get('/spr/{sprId}', [VisiteController::class, 'getVisitesBySpr']);
    });
});

// Route for AuthController
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});

// Routes for SprController
Route::prefix('spr')->group(function () {
    Route::get('/', [SprController::class, 'index']);
    Route::get('{id}', [SprController::class, 'show']);
    Route::get('/{id}/creneaux', [SprController::class, 'getCreneauxBySpr']);
});
