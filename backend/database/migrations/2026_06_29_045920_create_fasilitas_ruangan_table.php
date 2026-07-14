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
            
            $table->foreignId('fasilitas_id')
                ->constrained('fasilitas') //foreign key tabel fasilitas
                ->cascadeOnDelete();

            $table->foreignId('ruangan_id')
                ->constrained('ruangan') //foreign key tabel ruangan
                ->cascadeOnDelete();

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
