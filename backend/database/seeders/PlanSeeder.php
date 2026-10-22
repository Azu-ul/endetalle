<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        // Precios MENSUALES de ejemplo (price_ars en pesos, price_usd en dólares).
        // Los reales los define Guillermo; los períodos de 3 meses y anual se calculan solos.
        $plans = [
            [
                'slug' => 'free', 'name' => 'Free', 'level' => 0, 'price' => 0,
                'price_ars' => 0, 'price_usd' => 0,
                'description' => 'Para conocer la biblioteca.',
                'features' => ['Hasta 20 detalles del catálogo abierto (cupo de por vida)', 'Visualización en web de láminas, especificaciones y materiales', 'Sin descargas'],
                'detail_limit' => 20, 'allows_dwg' => false, 'allows_skp' => false, 'allows_ebooks' => false,
                'is_recommended' => false, 'highlight_color' => 'slate',
            ],
            [
                'slug' => 'estudiante', 'name' => 'Estudiante', 'level' => 1, 'price' => 9,
                'price_ars' => 12000, 'price_usd' => 9,
                'description' => 'Acceso completo para proyectos académicos.',
                'features' => ['Todo el catálogo', 'Visualización completa', 'Descargas ilimitadas de planos editables (.DWG)'],
                'detail_limit' => null, 'allows_dwg' => true, 'allows_skp' => false, 'allows_ebooks' => false,
                'is_recommended' => false, 'highlight_color' => 'slate',
            ],
            [
                'slug' => 'pro', 'name' => 'Pro', 'level' => 2, 'price' => 29,
                'price_ars' => 39000, 'price_usd' => 29,
                'description' => 'La herramienta definitiva para el arquitecto.',
                'features' => ['Todo lo del plan Estudiante', 'Detalles Premium exclusivos', 'Modelos 3D de SketchUp (.SKP)', 'Biblioteca de ebooks técnicos', 'Soporte prioritario'],
                'detail_limit' => null, 'allows_dwg' => true, 'allows_skp' => true, 'allows_ebooks' => true,
                'is_recommended' => true, 'highlight_color' => 'primary',
            ],
        ];

        foreach ($plans as $plan) {
            $plan['features'] = json_encode($plan['features'], JSON_UNESCAPED_UNICODE);
            DB::table('plans')->insertOrIgnore($plan + [
                'currency' => 'USD', 'interval' => 'month',
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }
    }
}
