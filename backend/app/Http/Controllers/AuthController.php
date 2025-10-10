<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

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

public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(8)],
            'nascimento' => ['nullable', 'date_format:d/m/Y'],
            'cpf' => ['nullable', 'string'],
            'telefone' => ['nullable', 'string', 'max:30'],
        ], [
            'password.confirmed' => 'As senhas nao coincidem.',
            'nascimento.date_format' => 'Data de nascimento invalida.',
        ]);

        $cpf = null;
        if (!empty($data['cpf'])) {
            $cpfDigits = preg_replace('/\D+/', '', $data['cpf']);
            if (strlen($cpfDigits) !== 11) {
                throw ValidationException::withMessages([
                    'cpf' => ['CPF deve ter 11 digitos.'],
                ]);
            }

            if (User::where('cpf', $cpfDigits)->exists()) {
                throw ValidationException::withMessages([
                    'cpf' => ['Este CPF ja esta cadastrado.'],
                ]);
            }

            $cpf = $cpfDigits;
        }

        $birthDate = !empty($data['nascimento'])
            ? Carbon::createFromFormat('d/m/Y', $data['nascimento'])->format('Y-m-d')
            : null;

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'phone' => !empty($data['telefone']) ? preg_replace('/\D+/', '', $data['telefone']) : null,
            'cpf' => $cpf,
            'birth_date' => $birthDate,
            'role' => 'cliente',
        ]);

        Auth::guard('web')->login($user);
        $request->session()->regenerate();

        return response()->json(['ok' => true], 201);
    }
}
