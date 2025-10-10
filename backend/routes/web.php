<?php
// Pode ficar vazio OU ter um healthcheck opcional:
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);

Route::get('/health', fn() => response()->noContent());
