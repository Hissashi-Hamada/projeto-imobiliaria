<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\CarbonImmutable;

class ProfileController extends Controller
{
    public function me(Request $request) {
        return response()->json($request->user());
    }

    public function update(Request $request) {
        $request->validate([
            'name'  => ['required','string','max:255'],
            'phone' => ['nullable','string','max:30'],
            'email' => ['required','email','max:255'],
        ]);

        $user = $request->user();
        $emailChanged = $request->email !== $user->email;

        $user->name = $request->name;
        $user->phone = $request->phone;

        $confirmationUrl = null;

        if ($emailChanged) {
            $user->pending_email = $request->email;
            $user->email_change_token = Str::random(64);
            $user->email_change_expires_at = CarbonImmutable::now()->addHours(24);
            $user->save();

            $confirmationUrl = url("/email-change/confirm/{$user->email_change_token}");

            // E-mail simples (sem Notifications/Fila)
            try {
                Mail::raw(
                    "VocÃª solicitou alterar seu e-mail. Confirme aqui: {$confirmationUrl}",
                    function ($m) use ($user) {
                        $m->to($user->pending_email)
                            ->subject('Confirme seu novo e-mail');
                    }
                );
            } catch (\Throwable $e) {
                // Em dev, o link jÃ¡ vai na resposta â€” segue o jogo.
            }
        } else {
            $user->save();
        }

        return response()->json([
            'message' => $emailChanged
                ? 'Perfil salvo. Enviamos um link para confirmar o novo e-mail (veja tambÃ©m o link de dev na resposta).'
                : 'Perfil salvo.',
            'confirmation_url' => $confirmationUrl, // Ãºtil em DEV sem SMTP
        ]);
    }

    public function changePassword(Request $request) {
        $request->validate([
            'current_password' => ['required'],
            'password' => ['required','string','min:8','confirmed'],
        ]);

        $user = $request->user();

        // Valida a atual manualmente (sem rule current_password)
        if (!password_verify($request->current_password, $user->password)) {
            return response()->json(['message' => 'Senha atual incorreta.'], 422);
        }

        $user->password = bcrypt($request->password);
        $user->save();

        // Sem e-mail de aviso para simplificar
        return response()->json(['message' => 'Senha alterada com sucesso.']);
    }

    public function confirmEmailChange(string $token) {
        $user = \App\Models\User::where('email_change_token', $token)->first();

        if (!$user) {
            abort(404, 'Token invÃ¡lido');
        }
        if (!$user->email_change_expires_at || now()->greaterThan($user->email_change_expires_at)) {
            abort(410, 'Token expirado');
        }

        $user->email = $user->pending_email;
        $user->pending_email = null;
        $user->email_change_token = null;
        $user->email_change_expires_at = null;
        $user->email_verified_at = now();
        $user->save();

        return redirect('/perfil?email=confirmado');
    }
}
