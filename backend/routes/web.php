<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisteredUserController;

// ===== LOGIN =====
// Mostra o formulário de login
Route::get('/login', [LoginController::class, 'create'])->name('login');
// Processa o login
Route::post('/login', [LoginController::class, 'store']);

// ===== REGISTRO =====
// Mostra o formulário de registro
Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
// Processa o registro
Route::post('/register', [RegisteredUserController::class, 'store']);

// ===== LOGOUT =====
Route::post('/logout', [LogoutController::class, 'destroy'])->name('logout');

// ===== ÁREA PROTEGIDA =====
Route::middleware('auth')->group(function () {
    Route::get('/', function () {
        return view('welcome'); // dashboard
    })->name('dashboard');
});
