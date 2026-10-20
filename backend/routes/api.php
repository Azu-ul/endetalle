<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DetailController;
use App\Http\Controllers\SiteController;
use Illuminate\Support\Facades\Route;

// Públicas
Route::get('/settings', [SiteController::class, 'settings']);
Route::get('/categories', [SiteController::class, 'categories']);
Route::get('/plans', [SiteController::class, 'plans']);
Route::get('/details', [DetailController::class, 'index']);
Route::get('/details/{slug}', [DetailController::class, 'show']);

// Autenticación
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:10,1');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:6,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);
});