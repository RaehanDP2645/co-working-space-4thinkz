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
            $table->increments('id'); //primary key tabel pemesanan
            $table->unsignedInteger('pengguna_id');
            $table->unsignedInteger('ruangan_id');
            $table->dateTime('waktu_mulai');
            $table->dateTime('waktu_selesai');
            $table->string('status', 20)->default('menunggu');
            $table->decimal('total_biaya', 12, 2);
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('pengguna_id')->references('id')->on('pengguna')->onDelete('cascade'); //foreign key tabel pengguna
            $table->foreign('ruangan_id')->references('id')->on('ruangan')->onDelete('cascade'); //foreign key tabel ruangan
            $table->index(['ruangan_id', 'waktu_mulai', 'waktu_selesai']);
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
