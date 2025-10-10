<?php
namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class RegisteredUserController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            "name"     => ["required","string","max:255"],
            "email"    => ["required","email","max:255","unique:users,email"],
            "password" => ["required","confirmed", Password::min(8)],
        ]);
        $user = User::create([
            "name"     => $data["name"],
            "email"    => $data["email"],
            "password" => Hash::make($data["password"]),
        ]);
        return response()->json(["message" => "registered", "user" => $user], 201);
    }
}
