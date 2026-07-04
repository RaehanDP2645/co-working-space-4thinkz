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
            $table->id();

            $table->unsignedInteger('pengguna_id');
            $table->foreign('pengguna_id')
                ->references('id')
                ->on('pengguna')
                ->cascadeOnDelete();

            $table->unsignedInteger('ruangan_id')->nullable();
            $table->foreign('ruangan_id')
                ->references('id')
                ->on('ruangan')
                ->nullOnDelete();

            $table->integer('jumlah_peserta');
            $table->decimal('anggaran', 10, 2);
            $table->string('kebutuhan_privasi');
            $table->text('alasan_rekomendasi');
            $table->string('jenis_aktivitas');

            $table->timestamps();
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
