<?php
namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller {
    public function register(Request $r){
        $r->validate([
        'name'=>'required|string|max:255',
        'email'=>'required|email|unique:users',
        'password'=>'required|string|min:8'
        ]);
        $user = User::create([
        'name'=>$r->name, 'email'=>$r->email, 'password'=>Hash::make($r->password)
        ]);
        $token = $user->createToken('web')->plainTextToken;
        return response()->json(['user'=>$user,'token'=>$token]);
    }

    public function login(Request $r){
        $r->validate(['email'=>'required|email','password'=>'required']);
        $user = User::where('email',$r->email)->first();
        if (!$user || !Hash::check($r->password, $user->password)) {
        throw ValidationException::withMessages(['email'=>['Credenciais inválidas.']]);
        }
        $token = $user->createToken('web')->plainTextToken;
        return response()->json(['user'=>$user,'token'=>$token]);
    }

    public function logout(Request $r){
        $r->user()->currentAccessToken()->delete();
        return response()->json(['ok'=>true]);
    }
}
