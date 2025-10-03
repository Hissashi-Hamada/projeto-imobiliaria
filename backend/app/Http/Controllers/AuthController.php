<?php
namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller {
    public function register(Request $r){
    $data = $r->validate([
        'name'=>'required|string|max:255',
        'email'=>'required|email|unique:users,email',
        'password'=>'required|string|min:8',
    ]);

    $user = \App\Models\User::create([
        'name' => $data['name'],
        'email'=> $data['email'],
        'password'=> bcrypt($data['password']),
    ]);

    $token = $user->createToken('web')->plainTextToken;
    return response()->json(['user'=>$user,'token'=>$token], 201);
}

public function login(Request $r){
    $r->validate(['email'=>'required|email','password'=>'required']);
    $user = \App\Models\User::where('email',$r->email)->first();
    if(!$user || !\Illuminate\Support\Facades\Hash::check($r->password, $user->password)){
        return response()->json(['message'=>'Credenciais inválidas'], 422);
    }
    $token = $user->createToken('web')->plainTextToken;
    return ['user'=>$user,'token'=>$token];
}

}
