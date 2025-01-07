<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CreneauxController;

Route::get('/users', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// Routes de UserController
Route::prefix('users')->group(function() {
    Route::get('/', [UserController::class, 'index']);
    Route::get('{userId}', [UserController::class, 'show']);
    Route::post('/', [UserController::class, 'store']);
    Route::put('{userId}', [UserController::class, 'update']);
    Route::delete('{userId}', [UserController::class, 'destroy']);
});

// Routes de CreneauxController
Route::prefix('creneaux')->group(function() {
    Route::get('/', [CreneauxController::class, 'index']);
});

// Autres controllers...
