<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ruangan', function (Blueprint $table) {
            $table->renameColumn('harga', 'harga_per_jam');
            $table->string('gambar')->nullable()->after('harga_per_jam');
            $table->text('deskripsi')->nullable()->after('gambar');
        });
    }

    public function down(): void
    {
        Schema::table('ruangan', function (Blueprint $table) {
            $table->dropColumn(['gambar', 'deskripsi']);
            $table->renameColumn('harga_per_jam', 'harga');
        });
    }
};
