<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class ProfileUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_updates_profile_without_changing_email(): void
    {
        $user = User::factory()->create([
            'name' => 'Fulano',
            'email' => 'fulano@example.test',
            'phone' => '11999999999',
        ]);

        $this->actingAs($user);

        $payload = [
            'name' => 'Fulano da Silva',
            'phone' => '11988887777',
            'email' => 'fulano@example.test',
        ];

        $response = $this->putJson('/api/profile', $payload);

        $response->assertOk()->assertJson(fn (AssertableJson $json) => $json
            ->where('message', 'Perfil salvo.')
            ->where('confirmation_url', null)
        );

        $user->refresh();

        $this->assertSame('Fulano da Silva', $user->name);
        $this->assertSame('11988887777', $user->phone);
        $this->assertSame('fulano@example.test', $user->email);
        $this->assertNull($user->pending_email);
        $this->assertNull($user->email_change_token);
        $this->assertNull($user->email_change_expires_at);
    }

    public function test_user_updates_profile_with_email_change(): void
    {
        $user = User::factory()->create([
            'name' => 'Ciclana',
            'email' => 'ciclana@example.test',
            'phone' => null,
        ]);

        $this->actingAs($user);

        $newEmail = 'ciclana.nova@example.test';

        $payload = [
            'name' => 'Ciclana Pereira',
            'phone' => '21912341234',
            'email' => $newEmail,
        ];

        $response = $this->putJson('/api/profile', $payload);

        $response->assertOk()->assertJson(fn (AssertableJson $json) => $json
            ->where('message', fn (string $message) => str_starts_with($message, 'Perfil salvo.'))
            ->where('confirmation_url', fn (?string $url) => $url !== null && str_contains($url, '/email-change/confirm/'))
        );

        $user->refresh();

        $this->assertSame('Ciclana Pereira', $user->name);
        $this->assertSame('21912341234', $user->phone);
        $this->assertSame('ciclana@example.test', $user->email, 'Email principal só deve mudar após confirmação.');
        $this->assertSame($newEmail, $user->pending_email);
        $this->assertNotNull($user->email_change_token);
        $this->assertNotNull($user->email_change_expires_at);
        $this->assertTrue(Carbon::parse($user->email_change_expires_at)->greaterThan(now()));
    }
}
