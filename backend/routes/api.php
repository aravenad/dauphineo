<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AvisController;
use App\Http\Controllers\Api\GuideController;
use App\Http\Controllers\Api\RecommandationController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\SprController;
use App\Http\Controllers\Api\UtilisateurController;
use Illuminate\Support\Facades\Route;

// Routes publiques
Route::prefix('auth')->middleware('throttle:10,1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/confirmer', [AuthController::class, 'confirmer']);
});

Route::prefix('spr')->group(function () {
    Route::get('/', [SprController::class, 'index']);
    Route::get('/top', [SprController::class, 'topSpr']);
    Route::get('/{id}', [SprController::class, 'show'])->whereNumber('id');
    Route::get('/{id}/creneaux', [SprController::class, 'getCreneauxBySpr'])->whereNumber('id');
    Route::get('/{id}/visites', [SprController::class, 'getVisitesBySpr'])->whereNumber('id');
    Route::get('/{id}/avis', [AvisController::class, 'indexBySpr'])->whereNumber('id');
});

Route::prefix('guides')->group(function () {
    Route::get('/{id}', [GuideController::class, 'show'])->whereNumber('id');
    Route::get('/{id}/disponibilites', [GuideController::class, 'disponibilitesGuide'])->whereNumber('id');
});

Route::get('/avis/{id}', [AvisController::class, 'show'])->whereNumber('id');

// Chaque appel peut solliciter l'API Anthropic : limite plus stricte
Route::post('/recommandations', [RecommandationController::class, 'store'])->middleware('throttle:10,1');

// Routes réservées aux utilisateurs connectés
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('utilisateur')->group(function () {
        Route::get('/', [UtilisateurController::class, 'show']);
        Route::put('/', [UtilisateurController::class, 'update'])->middleware('throttle:ecriture');
        Route::delete('/', [UtilisateurController::class, 'destroy'])->middleware('throttle:ecriture');
        Route::post('/logout', [UtilisateurController::class, 'logout']);
        Route::get('/visites', [UtilisateurController::class, 'getUserVisites']);
        Route::get('/reservations', [UtilisateurController::class, 'getUserReservations']);
        Route::get('/avis', [UtilisateurController::class, 'getUserAvis']);
    });

    Route::middleware('throttle:ecriture')->group(function () {
        Route::post('/avis', [AvisController::class, 'store']);
        Route::delete('/avis/{id}', [AvisController::class, 'destroy'])->whereNumber('id');

        Route::post('/reservations', [ReservationController::class, 'store']);
        Route::delete('/reservations/{id}', [ReservationController::class, 'destroy'])->whereNumber('id');
    });
});
