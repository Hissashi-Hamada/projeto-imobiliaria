<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // admin
        $admin = \App\Models\User::firstOrCreate(
            ['email' => 'admin@imobiliaria.test'],
            ['name' => 'Admin', 'password' => bcrypt('Admin@123'), 'role' => 'admin']
        );

        // alguns imóveis
        \App\Models\Imovel::factory()->count(20)->create([
            'user_id' => $admin->id,
        ]);
    }
}
