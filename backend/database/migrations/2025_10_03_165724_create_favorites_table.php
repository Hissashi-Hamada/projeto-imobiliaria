<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('favorites', function (Blueprint $t) {
            $t->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $t->foreignId('imovel_id')->constrained('imovels')->onDelete('cascade');
            $t->primary(['user_id','imovel_id']);
            $t->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('favorites');
    }
};
