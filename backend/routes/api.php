<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ImovelController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;

Route::apiResource('imoveis', ImovelController::class);

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [ProfileController::class,'me']);
    Route::put('/profile', [ProfileController::class,'update']);
    Route::post('/profile/change-password', [ProfileController::class,'changePassword']);
});

Route::get('/email-change/confirm/{token}', [ProfileController::class,'confirmEmailChange']);
