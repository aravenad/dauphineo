<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\ImagesController;
use App\Http\Controllers\Api\SprController;
use App\Http\Controllers\Api\GuideController;
use App\Http\Controllers\Api\AvisController;


Route::get('/users', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// Routes de UserController
Route::prefix(prefix: 'users')->group(function() {
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
    Route::post('/', [SprController::class, 'store']);
    Route::put('{id}', [SprController::class, 'update']);
    Route::delete('{id}', [SprController::class, 'destroy']);
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

// Autres controllers...

Route::prefix(prefix: 'reservations')->group(function() {
    Route::get('/', [ReservationController::class, 'index']);
    Route::post('/', [ReservationController::class, 'store']);
    Route::patch('{reservationId}', [ReservationController::class, 'updateStatus']);
});
