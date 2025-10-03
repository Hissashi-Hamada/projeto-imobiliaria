<?php

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Imovel;
use App\Models\User;

class ImovelFactory extends Factory {
    protected $model = Imovel::class;

    public function definition(): array {
        $titulo = $this->faker->streetName().' '.$this->faker->buildingNumber();
        return [
            'titulo' => $titulo,
            'slug' => Str::slug($titulo.'-'.$this->faker->unique()->numberBetween(1000,9999)),
            'descricao' => $this->faker->paragraph(3),
            'tipo' => $this->faker->randomElement(['casa','apartamento','terreno','comercial']),
            'status' => $this->faker->randomElement(['venda','aluguel']),
            'preco_centavos' => $this->faker->numberBetween(90000, 2500000)*100,
            'quartos' => $this->faker->numberBetween(0,5),
            'suites' => $this->faker->numberBetween(0,3),
            'banheiros' => $this->faker->numberBetween(1,4),
            'vagas' => $this->faker->numberBetween(0,3),
            'cidade' => 'São Paulo',
            'bairro' => $this->faker->streetName(),
            'logradouro' => $this->faker->streetAddress(),
            'user_id' => User::factory(), // cria dono junto
        ];
    }
}
