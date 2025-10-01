<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ImovelFactory extends Factory
{
    public function definition(): array
    {
        $tipos = ['casa','terreno','apartamento'];
        $status = ['venda','aluguel'];

        return [
            'titulo' => $this->faker->streetName().' - '.$this->faker->city(),
            'endereco' => $this->faker->address(),
            'descricao' => $this->faker->sentence(12),
            'tipo' => $this->faker->randomElement($tipos),
            'status' => $this->faker->randomElement($status),
            'preco' => $this->faker->numberBetween(90000, 900000) * 100, // centavos
            'imagens' => [$this->faker->imageUrl(640, 480, 'house', true)],
            'created_at' => $this->faker->dateTimeBetween('-60 days', 'now'),
            'updated_at' => now(),
        ];
    }
}
