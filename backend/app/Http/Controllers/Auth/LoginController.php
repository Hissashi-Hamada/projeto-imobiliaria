<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email'    => ['required','email'],
            'password' => ['required'],
        ]);

        // mantém sessão (remember = true opcional)
        if (Auth::attempt($credentials, true)) {
            $request->session()->regenerate();
            return response()->json(['message' => 'logged-in', 'user' => $request->user()], 200);
        }

        return response()->json(['message' => 'invalid-credentials'], 422);
    }
}
    