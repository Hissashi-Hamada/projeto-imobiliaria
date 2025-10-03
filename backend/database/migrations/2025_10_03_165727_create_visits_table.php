<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('visits', function (Blueprint $t) {
            $t->id();
            $t->foreignId('imovel_id')->constrained('imovels')->onDelete('cascade');
            $t->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $t->string('nome');
            $t->string('telefone')->nullable();
            $t->string('email')->nullable();
            $t->dateTime('data_hora');
            $t->enum('status',['pendente','confirmada','concluida','cancelada'])->default('pendente');
            $t->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('visits');
    }
};
