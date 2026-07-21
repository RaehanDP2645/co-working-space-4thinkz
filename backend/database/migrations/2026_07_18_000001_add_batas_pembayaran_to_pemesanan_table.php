<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // tambah batas pembayaran
    public function up(): void
    {
        Schema::table('pemesanan', function (Blueprint $table) {
            $table->dateTime('batas_pembayaran')
                ->nullable()
                ->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('pemesanan', function (Blueprint $table) {
            $table->dropColumn('batas_pembayaran');
        });
    }
};
