<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pembayaran', function (Blueprint $table) {
            $table->string('paywuzz_order_id')->nullable()->after('kode_invoice');
            $table->string('paywuzz_trx_id')->nullable()->after('paywuzz_order_id');
            $table->string('payment_type')->nullable()->after('metode_pembayaran');
            $table->string('payment_url')->nullable()->after('payment_type');
            $table->text('paywuzz_response')->nullable()->after('payment_url');
        });
    }

    public function down(): void
    {
        Schema::table('pembayaran', function (Blueprint $table) {
            $table->dropColumn([
                'paywuzz_order_id',
                'paywuzz_trx_id',
                'payment_type',
                'payment_url',
                'paywuzz_response',
            ]);
        });
    }
};
