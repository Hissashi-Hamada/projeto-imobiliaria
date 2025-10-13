<?php

namespace Database\Factories;

use App\Models\Imovel;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<\App\Models\Imovel> */
class ImovelFactory extends Factory
{
    protected $model = Imovel::class;

    public function definition(): array
    {
        $cepNumber = str_pad((string) $this->faker->numberBetween(0, 99999999), 8, '0', STR_PAD_LEFT);

        return [
            'titulo'   => $this->faker->sentence(3),
            'slug'     => $this->faker->unique()->slug(),
            'descricao'=> $this->faker->paragraph(),
            'tipo'     => $this->faker->randomElement(['casa','apartamento','terreno','comercial']),
            'status'   => $this->faker->randomElement(['venda','aluguel']),
            'preco_centavos' => $this->faker->numberBetween(150_000_00, 2_000_000_00),
            'area_total' => $this->faker->numberBetween(50, 400),
            'area_util'  => $this->faker->numberBetween(40, 350),
            'quartos'    => $this->faker->numberBetween(1, 5),
            'suites'     => $this->faker->numberBetween(0, 3),
            'banheiros'  => $this->faker->numberBetween(1, 4),
            'vagas'      => $this->faker->numberBetween(0, 3),
            'cep'        => substr($cepNumber, 0, 5) . '-' . substr($cepNumber, 5),
            'estado'     => $this->faker->randomElement(['SP','RJ','MG','RS','PR']),
            'cidade'     => $this->faker->city(),
            'bairro'     => $this->faker->streetName(),
            'logradouro' => $this->faker->streetAddress(),
            'numero'     => (string)$this->faker->numberBetween(1, 9999),
            'complemento'=> $this->faker->optional()->secondaryAddress(),
            'lat'        => $this->faker->latitude(-24, -3),
            'lng'        => $this->faker->longitude(-60, -34),
            'published_at' => $this->faker->optional(0.8)->dateTimeBetween('-30 days', 'now'),
            'user_id'    => 1,
        ];
    }
}
