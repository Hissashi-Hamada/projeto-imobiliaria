<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('users', 'cpf') || !Schema::hasColumn('users', 'birth_date')) {
            Schema::table('users', function (Blueprint $table) {
                if (!Schema::hasColumn('users', 'cpf')) {
                    $table->string('cpf', 14)->nullable()->unique()->after('email');
                }

                if (!Schema::hasColumn('users', 'birth_date')) {
                    $table->date('birth_date')->nullable()->after('cpf');
                }
            });
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'birth_date')) {
                $table->dropColumn('birth_date');
            }

            if (Schema::hasColumn('users', 'cpf')) {
                $table->dropColumn('cpf');
            }
        });
    }
};
