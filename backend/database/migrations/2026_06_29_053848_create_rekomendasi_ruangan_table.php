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

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('ruangan_id')
                ->nullable()
                ->constrained('ruangan')
                ->nullOnDelete();

            $table->unsignedInteger('jumlah_peserta');
            $table->decimal('anggaran', 12, 2);

            $table->enum('kebutuhan_privasi', [
                'publik',
                'semi_private',
                'private'
            ]);

            $table->text('alasan_rekomendasi');

            $table->enum('jenis_aktivitas', [
                'meeting',
                'presentasi',
                'event',
                'work',
                'diskusi'
            ]);

            $table->decimal('skor_rekomendasi',5,2)
                ->nullable();

            $table->index('jenis_aktivitas', 'jumlah_peserta');
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
