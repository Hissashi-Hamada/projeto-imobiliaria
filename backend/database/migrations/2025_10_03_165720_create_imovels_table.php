<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('imovels', function (Blueprint $t) {
            $t->id();
            $t->string('titulo');
            $t->string('slug')->unique();
            $t->text('descricao')->nullable();
            $t->enum('tipo',['casa','apartamento','terreno','comercial']);
            $t->enum('status',['venda','aluguel']);
            $t->unsignedBigInteger('preco_centavos')->default(0);
            $t->unsignedInteger('area_total')->nullable();
            $t->unsignedInteger('area_util')->nullable();
            $t->unsignedTinyInteger('quartos')->default(0);
            $t->unsignedTinyInteger('suites')->default(0);
            $t->unsignedTinyInteger('banheiros')->default(0);
            $t->unsignedTinyInteger('vagas')->default(0);

            // Endereço
            $t->string('cep',9)->nullable();
            $t->string('estado',2)->nullable();
            $t->string('cidade',80)->nullable();
            $t->string('bairro',120)->nullable();
            $t->string('logradouro',120)->nullable();
            $t->string('numero',20)->nullable();
            $t->string('complemento',80)->nullable();

            // Geo
            $t->decimal('lat',10,7)->nullable();
            $t->decimal('lng',10,7)->nullable();

            $t->timestamp('published_at')->nullable();
            $t->foreignId('user_id')->constrained('users')->cascadeOnDelete(); // dono/corretor
            $t->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('imovels');
    }
};
