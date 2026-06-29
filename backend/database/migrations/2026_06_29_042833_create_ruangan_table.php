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
        Schema::create('ruangan', function (Blueprint $table) {
            $table->increments('id'); //primary key id_ruangan
            $table->string('nama_ruangan', 100);
            $table->string('jenis_ruangan', 50);
            $table->unsignedInteger('kapasitas');
            $table->decimal('harga', 12, 2); //format harga Rp2.xxx.xxx,xx
            $table->string('tingkat_privasi', 10)-> default('rendah');
            $table->boolean('mendukung_presentasi')->default('false');
            $table->boolean('mendukung_event')->default('false');
            $table->string('status', 20)->default('tersedia'); //status ketersediaan ruangan
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ruangan');
    }
};
