<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Imovel;

class DatabaseSeeder extends Seeder
{
  public function run(): void
  {
    Imovel::factory()->count(20)->create();
  }
}
