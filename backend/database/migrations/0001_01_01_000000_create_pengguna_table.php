<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // buat tabel pengguna/user
        Schema::create('pengguna', function (Blueprint $table) {
            $table->increments('id'); //primary key
            $table->string('nama', 100); //nama
            $table->string('email', 100)->unique(); //email
            $table->timestamp('email_verified_at')->nullable();            $table->string('password');
            $table->string('no_telepon', 20)->nullable(); //no.hp (opsional)
            $table->string('google_id')->nullable()->unique(); //id_sso_google
            $table->string('peran', 20)->default('user'); //role default user
            $table->rememberToken();
            $table->timestamps();
        });
        
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengguna');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
