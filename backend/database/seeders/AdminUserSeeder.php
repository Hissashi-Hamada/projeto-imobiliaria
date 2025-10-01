<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@imobiliaria.test'],
            [
                'name' => 'Admin Demo',
                'password' => Hash::make('Demo@12345'),
                'is_admin' => true,
            ]
        );
    }
}
