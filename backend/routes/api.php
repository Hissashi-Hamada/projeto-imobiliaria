<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ImovelController;
use App\Http\Controllers\ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/imoveis', [ImovelController::class, 'index']);
Route::get('/imoveis/{imovel}', [ImovelController::class, 'show']);

Route::middleware('web')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', fn (Request $r) => $r->user());

        Route::post('/logout', function (Request $r) {
            Auth::guard('web')->logout();
            $r->session()->invalidate();
            $r->session()->regenerateToken();
            return response()->noContent();
        });

        Route::get('/profile', [ProfileController::class, 'me']);
        Route::put('/profile', [ProfileController::class, 'update']);

        Route::middleware('admin')->group(function () {
            Route::post('/imoveis', [ImovelController::class, 'store']);
            Route::put('/imoveis/{imovel}', [ImovelController::class, 'update']);
            Route::delete('/imoveis/{imovel}', [ImovelController::class, 'destroy']);
        });
    });
});

// suas outras rotas protegidas...
