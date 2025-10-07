<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;

Route::post('/register', [RegisteredUserController::class, 'store'])->name('register');
// (quando fizer login, algo como: Route::post('/login', [...]);)


// login por sessão (Sanctum SPA usa cookie)
Route::post('/login', [LoginController::class, 'store'])->name('login');

// logout
Route::post('/logout', [LogoutController::class, 'destroy'])->name('logout');

Route::get("/", function () {
    return view("welcome");
});



