<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $r)
    {
        $data = $r->validate([
            'name'     => ['required','string','max:255'],
            'email'    => ['required','email','max:255','unique:users,email'],
            'password' => ['required','string','min:8'],
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        // faz login e gera cookie de sessÃ£o
        Auth::login($user, true);
        $r->session()->regenerate();

        return response()->json(['message' => 'ok', 'user' => $user], 201);
    }

    public function login(Request $r)
    {
        $cred = $r->validate([
            'email'    => ['required','email'],
            'password' => ['required','string'],
        ]);

        if (!Auth::attempt($cred, true)) {
            return response()->json(['message' => 'Credenciais invÃ¡lidas'], 422);
        }
        $r->session()->regenerate();

        return response()->json(['message' => 'ok']);
    }

    public function logout(Request $r)
    {
        Auth::guard('web')->logout();
        $r->session()->invalidate();
        $r->session()->regenerateToken();

        return response()->json(['message' => 'ok']);
    }
}
