<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rekomendasi_ruangan', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('pengguna_id');
            $table->unsignedInteger('ruangan_id');
            $table->unsignedInteger('jumlah_peserta');
            $table->string('jenis_aktivitas', 100)->nullable();
            $table->decimal('anggaran', 12, 2)->nullable();
            $table->string('kebutuhan_privasi', 10)->nullable();
            $table->timestamps();
            $table->foreign('pengguna_id')->references('id')->on('pengguna')->onDelete('cascade');
            $table->foreign('ruangan_id')->references('id')->on('ruangan')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rekomendasi_ruangan');
    }
};
