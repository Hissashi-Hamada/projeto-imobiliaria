<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('imovel_images', function (Blueprint $t) {
            $t->id();
            $t->foreignId('imovel_id')->constrained('imovels')->onDelete('cascade');
            $t->string('path');
            $t->unsignedSmallInteger('ordem')->default(0);
            $t->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('imovel_images');
    }
};

