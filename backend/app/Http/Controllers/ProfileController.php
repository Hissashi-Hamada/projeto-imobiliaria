<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;

class ProfileController extends Controller {
    public function show(Request $r) { return response()->json($r->user()); }
    public function update(Request $r) {
        $data = $r->validate(['name'=>'sometimes|string','email'=>'sometimes|email']);
        $user = $r->user();
        $user->update($data);
        return response()->json($user);
    }
}
