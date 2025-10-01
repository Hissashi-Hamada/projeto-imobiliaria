<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ImovelController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController

Route::apiResource('imoveis', ImovelController::class);;
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function(){
  Route::get('profile', [ProfileController::class,'show']);
  Route::put('profile', [ProfileController::class,'update']);
});
