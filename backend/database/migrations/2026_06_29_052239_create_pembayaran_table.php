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
            $table->increments('id'); //primary key tabel pembayaran
            $table->unsignedInteger('pemesanan_id');
            $table->decimal('jumlah_bayar', 12, 2);
            $table->string('metode_pembayaran', 30)->nullable();
            $table->string('status', 20)->default('belum_lunas');
            $table->dateTime('waktu_pembayaran')->nullable();
            $table->timestamps();
            $table->foreign('pemesanan_id')->references('id')->on('pemesanan')->onDelete('cascade'); //foreign key tabel pemesanan
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembayarann');
    }
};
