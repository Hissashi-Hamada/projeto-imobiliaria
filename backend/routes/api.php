<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ImovelController;

// Retorna usuário logado (usado pelo frontend SPA)
Route::middleware('auth:sanctum')->get('/me', function ($request) {
    return $request->user();
});

// ===== ROTAS DE PERFIL =====
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
});

// ===== ROTAS DE IMÓVEIS =====
Route::apiResource('imoveis', ImovelController::class);
