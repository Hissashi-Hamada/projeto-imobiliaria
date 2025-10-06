<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Imovel;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@imobiliaria.test'],
            ['name' => 'Admin Demo', 'password' => Hash::make('Demo@12345')]
        );

        Imovel::factory(20)->create(['user_id' => $admin->id]);
    }
}
