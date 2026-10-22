<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Precio MENSUAL de cada plan en pesos (Mercado Pago) y en dólares (PayPal).
        // Los períodos (3 meses, anual) y sus descuentos se calculan desde estos valores.
        Schema::table('plans', function (Blueprint $table) {
            $table->decimal('price_ars', 12, 2)->default(0)->after('price');
            $table->decimal('price_usd', 10, 2)->default(0)->after('price_ars');
        });

        // La columna vieja "price" estaba en dólares
        DB::table('plans')->update(['price_usd' => DB::raw('price')]);
    }

    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->dropColumn(['price_ars', 'price_usd']);
        });
    }
};
