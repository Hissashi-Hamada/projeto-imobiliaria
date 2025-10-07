<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $r)
    {
        $cred = $r->validate([
            'email' => ['required','email'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt($cred)) {
            return response()->json(['message'=>'Credenciais inválidas'], 422);
        }

        $r->session()->regenerate(); // importante p/ CSRF/session fixation
        return response()->json(['ok'=>true]);
    }

    public function logout(Request $r)
    {
        Auth::guard('web')->logout();
        $r->session()->invalidate();
        $r->session()->regenerateToken();
        return response()->json(['ok'=>true]);
    }
}
