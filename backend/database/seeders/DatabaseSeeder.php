<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Imovel;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Credenciais do admin vindas do .env (mais seguro)
        $adminEmail = env('ADMIN_EMAIL', 'admin@imobiliaria.test');
        $adminName  = env('ADMIN_NAME',  'Admin Demo');
        $adminPass  = env('ADMIN_PASSWORD', 'Demo@12345');

        // 1) Garante ADMIN sem rehashar sempre
        $admin = User::firstOrCreate(
            ['email' => $adminEmail],
            [
                'name'              => $adminName,
                'password'          => Hash::make($adminPass), // só na 1ª vez
                'role'              => 'admin',
                'email_verified_at' => now(),
                'remember_token'    => Str::random(10),
            ]
        );

        if ($admin->role !== 'admin') {
            $admin->forceFill(['role' => 'admin'])->save();
        }

        // 2) Popular dados DEMO só em local/dev
        if (app()->environment(['local','development'])) {
            // cria imóveis do admin se ainda não existem
            if (!Imovel::where('user_id', $admin->id)->exists()) {
                Imovel::factory(20)->create(['user_id' => $admin->id]);
            }

            // usuários comuns de exemplo
            if (User::count() < 4) {
                User::factory()->count(3)->create();
            }
        }
    }
}
