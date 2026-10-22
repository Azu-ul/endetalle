<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Precio mensual en pesos: solo si todavía está en 0 (no pisa precios ya cargados)
        DB::table('plans')->where('slug', 'estudiante')->where('price_ars', 0)->update(['price_ars' => 12000]);
        DB::table('plans')->where('slug', 'pro')->where('price_ars', 0)->update(['price_ars' => 39000]);

        // Precio en dólares: si quedó en 0, se toma de la columna vieja "price"
        DB::table('plans')->where('price_usd', 0)->where('price', '>', 0)->update(['price_usd' => DB::raw('price')]);

        $now = now();

        DB::table('plans')->where('slug', 'free')->update([
            'description' => 'Para conocer la biblioteca.',
            'features' => json_encode([
                'Hasta 20 detalles del catálogo abierto (cupo de por vida)',
                'Visualización en web de láminas, especificaciones y materiales',
                'Sin descargas',
            ], JSON_UNESCAPED_UNICODE),
            'updated_at' => $now,
        ]);

        // Estudiante ve todo el catálogo (antes tenía límite 100)
        DB::table('plans')->where('slug', 'estudiante')->update([
            'detail_limit' => null,
            'description' => 'Acceso completo para proyectos académicos.',
            'features' => json_encode([
                'Todo el catálogo',
                'Visualización completa',
                'Descargas ilimitadas de planos editables (.DWG)',
            ], JSON_UNESCAPED_UNICODE),
            'updated_at' => $now,
        ]);

        DB::table('plans')->where('slug', 'pro')->update([
            'features' => json_encode([
                'Todo lo del plan Estudiante',
                'Detalles Premium exclusivos',
                'Modelos 3D de SketchUp (.SKP)',
                'Biblioteca de ebooks técnicos',
                'Soporte prioritario',
            ], JSON_UNESCAPED_UNICODE),
            'updated_at' => $now,
        ]);
    }

    public function down(): void
    {
        // Corrección de datos: no se revierte
    }
};