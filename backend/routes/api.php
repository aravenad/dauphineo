<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\ImagesController;
use App\Http\Controllers\Api\SprController;
use App\Http\Controllers\Api\GuideController;
use App\Http\Controllers\Api\AvisController;
use App\Http\Controllers\Api\CreneauxController;

Route::get('/utilisateur', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Routes de UserController
Route::prefix('utilisateur')->group(function() {
    Route::get('/', [UserController::class, 'index']);
    Route::get('{userId}', [UserController::class, 'show']);
    Route::post('/', [UserController::class, 'store']);
    Route::put('{userId}', [UserController::class, 'update']);
    Route::delete('{userId}', [UserController::class, 'destroy']);
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
    Route::post('/', [GuideController::class, 'store']);
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
    Route::get('/', [CreneauxController::class, 'index']);
});
