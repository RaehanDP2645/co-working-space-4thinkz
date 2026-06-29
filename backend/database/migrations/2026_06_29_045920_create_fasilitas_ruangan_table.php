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
        Schema::create('fasilitas_ruangan', function (Blueprint $table) {
            $table->unsignedInteger('fasilitas_id'); //primary key tabel fasilitas
            $table->unsignedInteger('ruangan_id'); //primary key tabel ruangan
            $table->foreign('fasilitas_id')->references('id')->on('fasilitas')->onDelete('cascade'); //foreign key tabel fasilitas
            $table->foreign('ruangan_id')->references('id')->on('ruangan')->onDelete('cascade'); //foreign key tabel ruangan
            $table->primary(['fasilitas_id', 'ruangan_id']); //composite primary key fasilitas-ruangan
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fasilitas_ruangan');
    }
};
