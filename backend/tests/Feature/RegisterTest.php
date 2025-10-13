<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class RegisterTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_success()
    {
        $payload = [
            'name' => 'Test User',
            'email' => 'testuser@example.test',
            'password' => 'Secret123!',
            'password_confirmation' => 'Secret123!'
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(201)->assertJson(['ok' => true]);

        $this->assertDatabaseHas('users', ['email' => 'testuser@example.test']);
    }

    public function test_register_fails_on_short_password()
    {
        $payload = [
            'name' => 'Bad User',
            'email' => 'baduser@example.test',
            'password' => 'short',
            'password_confirmation' => 'short'
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(422);
    }

    public function test_register_fails_on_duplicate_email()
    {
        // create user directly since factory may not exist in this project
        User::create([
            'name' => 'Existing',
            'email' => 'dup@example.test',
            'password' => bcrypt('Secret123!'),
            'role' => 'cliente'
        ]);

        $payload = [
            'name' => 'Dup User',
            'email' => 'dup@example.test',
            'password' => 'Secret123!',
            'password_confirmation' => 'Secret123!'
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(422);
    }
}
