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
        Schema::create('riwayat_pemesanan', function (Blueprint $table) {
            $table->id(); //primary key tabel riwayat_pemesanan
            
            $table->foreignId('pemesanan_id')
                ->constrained('pemesanan')
                ->cascadeOnDelete();

            $table->enum('status_sebelumnya', [
                'pending',
                'paid',
                'confirmed',
                'completed',
                'cancelled'
            ])->nullable();

            $table->enum('status_sekarang', [
                'pending',
                'paid',
                'confirmed',
                'completed',
                'cancelled'
            ]);

            $table->timestamp('waktu_perubahan')
                ->useCurrent();
                
            $table->index('pemesanan_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('riwayat_pemesanan');
    }
};
