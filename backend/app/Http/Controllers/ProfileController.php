<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function show(Request $r)
    {
        return $r->user(); // retorna user autenticado
    }

    public function update(Request $r)
    {
        $user = $r->user();

        $data = $r->validate([
            'name'  => ['required','string','max:255'],
            'phone' => ['nullable','string','max:30'],
            // email opcional: só se quiser permitir alteração, garanta unique ignorando o próprio id
            'email' => ['nullable','email', Rule::unique('users','email')->ignore($user->id)],
            // senha é opcional; se vier, atualiza
            'password' => ['nullable','string','min:8'],
        ]);

        if (!empty($data['email']))  $user->email = $data['email'];
        $user->name  = $data['name'];
        $user->phone = $data['phone'] ?? $user->phone;

        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        $user->save();

        return response()->json(['message'=>'Perfil atualizado', 'user'=>$user]);
    }
}
