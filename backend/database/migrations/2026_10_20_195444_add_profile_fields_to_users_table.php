<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('avatar_url', 2048)->nullable()->after('email');
            $table->string('cover_url', 2048)->nullable();
            $table->string('profession')->nullable();
            $table->string('company')->nullable();
            $table->text('bio')->nullable();
            $table->date('birth_date')->nullable();
            $table->json('interests')->nullable();
            $table->string('portfolio_url', 2048)->nullable();
            $table->string('status', 20)->default('active'); // active | suspended
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'avatar_url', 'cover_url', 'profession', 'company', 'bio',
                'birth_date', 'interests', 'portfolio_url', 'status',
            ]);
        });
    }
};