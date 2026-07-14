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
        Schema::create('pemesanan', function (Blueprint $table) {
            $table->id(); //primary key tabel pemesanan

            $table->string('kode_pemesanan')
                ->unique();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('ruangan_id')
                ->constrained('ruangan')
                ->cascadeOnDelete();

            $table->dateTime('waktu_mulai');
            $table->dateTime('waktu_selesai');

            $table->enum('status', [
                'pending',
                'paid',
                'confirmed',
                'completed',
                'cancelled'
            ])->default('pending');

            $table->decimal('total_biaya', 12, 2);

            $table->unsignedInteger('jumlah_orang')->nullable();

            $table->text('catatan')
                ->nullable();

            $table->softDeletes();
            $table->timestamps();

            $table->index([
                'ruangan_id',
                'waktu_mulai',
                'waktu_selesai',
                'status'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pemesanan');
    }
};
