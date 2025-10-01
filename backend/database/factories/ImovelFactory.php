<?php

namespace Database\Factories;

use App\Models\Imovel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Imovel>
 */
class ImovelFactory extends Factory
{
    protected $model = Imovel::class;

    public function definition(): array
    {
        return [
            'titulo' => $this->faker->sentence(3),
            'endereco' => $this->faker->address(),
            'descricao' => $this->faker->paragraph(),
            'tipo' => $this->faker->randomElement(['casa', 'terreno', 'apartamento']),
            'status' => $this->faker->randomElement(['venda', 'aluguel']),
            'preco' => $this->faker->numberBetween(10000, 1000000),
            'imagens' => $this->faker->randomElements([
                $this->faker->imageUrl(),
                $this->faker->imageUrl(),
                $this->faker->imageUrl(),
            ], $this->faker->numberBetween(0, 3)),
        ];
    }
}