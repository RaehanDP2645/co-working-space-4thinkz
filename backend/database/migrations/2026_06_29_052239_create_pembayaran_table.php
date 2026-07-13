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
        Schema::create('pembayaran', function (Blueprint $table) {
            $table->id(); //primary key tabel pembayaran
            
            $table->foreignId('pemesanan_id')
                ->constrained('pemesanan')
                ->cascadeOnDelete();
            
            $table->string('kode_invoice')
                ->unique();

            $table->decimal('jumlah_bayar', 12, 2);

            $table->enum('metode_pembayaran', [
                'transfer_bank',
                'qris',
                'ewallet',
                'credit_card'
            ])->nullable();


            $table->enum('status', [
                'pending',
                'paid',
                'failed',
                'refund'
            ])->default('belum_lunas');

            $table->dateTime('waktu_pembayaran')
                ->nullable();
            
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembayaran');
    }
};
