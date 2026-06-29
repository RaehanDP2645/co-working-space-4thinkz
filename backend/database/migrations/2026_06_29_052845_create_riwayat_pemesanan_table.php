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
            $table->increments('id'); //primary key tabel riwayat_pemesanan
            $table->unsignedInteger('pemesanan_id');
            $table->decimal('status_sebelumnya', 20)->nullable();
            $table->string('status_sekarang', 20);
            $table->string('waktu_perubahan')->useCurrent();
            $table->timestamps();
            $table->foreign('pemesanan_id')->references('id')->on('pemesanan')->onDelete('cascade'); //foreign key tabel pemesanan
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
