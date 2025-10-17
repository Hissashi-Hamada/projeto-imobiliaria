<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<\App\Models\User> */
class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        $name = $this->faker->name();
        $cpf = $this->faker->unique()->numerify('###.###.###-##');
        $birthDate = $this->faker->optional()->dateTimeBetween('-65 years', '-18 years');

        return [
            'name' => $name,
            'email' => $this->faker->unique()->safeEmail(),
            'pending_email' => null,
            'email_verified_at' => now(),
            'email_change_token' => null,
            'email_change_expires_at' => null,
            'cpf' => $cpf,
            'birth_date' => $birthDate ? $birthDate->format('Y-m-d') : null,
            'password' => bcrypt('password'),
            'remember_token' => Str::random(10),
            'role' => $this->faker->randomElement(['cliente', 'corretor']),
            'phone' => $this->faker->optional()->phoneNumber(),
            'avatar' => null,
        ];
    }

    public function unverified(): self
    {
        return $this->state(fn () => [
            'email_verified_at' => null,
        ]);
    }
}
