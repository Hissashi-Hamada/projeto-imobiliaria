<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('leads', function (Blueprint $t) {
            $t->id();
            $t->foreignId('imovel_id')->nullable()->constrained('imovels')->nullOnDelete();
            $t->string('nome');
            $t->string('email')->nullable();
            $t->string('telefone')->nullable();
            $t->text('mensagem')->nullable();
            $t->string('origem')->nullable(); // site, whatsapp...
            $t->enum('status',['novo','em_contato','concluido'])->default('novo');
            $t->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('leads');
    }
};
