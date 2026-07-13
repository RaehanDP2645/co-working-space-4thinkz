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
            $table->id(); //primary key id_ruangan
            $table->string('nama_ruangan', 100);

            $table->enum('jenis_ruangan', [
                'Meeting Room',
                'Private Office',
                'Open Space',
                'Event Space',
            ]);

            $table->unsignedInteger('kapasitas');
            $table->decimal('harga_per_jam', 12, 2); //format harga Rp2.xxx.xxx,xx
            
            $table->string('gambar_url')
                ->nullable();

            $table->enum('tingkat_privasi', [
                'publik',
                'semi_private',
                'private'
            ])-> default('publik');

            $table->boolean('mendukung_presentasi')
                ->default(false);
            
            $table->boolean('mendukung_event')
                ->default(false);
            
            $table->text('deskripsi')
                ->nullable();

            $table->softDeletes();
            $table->timestamps();
            $table->index('jenis_ruangan');
            $table->index('kapasitas');
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
