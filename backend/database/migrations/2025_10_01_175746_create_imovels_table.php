<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
    Schema::create('imovels', function (Blueprint $table) {
        $table->id();
        $table->string('titulo');
        $table->string('endereco')->nullable();
        $table->text('descricao')->nullable();
        $table->enum('tipo', ['casa','terreno','apartamento'])->default('casa');
        $table->enum('status', ['venda','aluguel'])->default('venda');
        $table->unsignedBigInteger('preco')->default(0); // centavos
        $table->json('imagens')->nullable();
        $table->timestamps();
    });
}


    public function down(): void
    {
        Schema::dropIfExists('imoveis');
    }
};