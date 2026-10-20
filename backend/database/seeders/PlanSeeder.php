<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'slug' => 'free', 'name' => 'Free', 'level' => 0, 'price' => 0,
                'description' => 'Para conocer la biblioteca.',
                'features' => ['Hasta 20 detalles del catálogo abierto', 'Visualización en web de láminas, especificaciones y materiales', 'Sin descargas'],
                'detail_limit' => 20, 'allows_dwg' => false, 'allows_skp' => false, 'allows_ebooks' => false,
                'is_recommended' => false, 'highlight_color' => 'slate',
            ],
            [
                'slug' => 'estudiante', 'name' => 'Estudiante', 'level' => 1, 'price' => 9,
                'description' => 'Acceso esencial para proyectos académicos.',
                'features' => ['Hasta 100 detalles', 'Visualización completa', 'Descargas ilimitadas de planos editables (.DWG)'],
                'detail_limit' => 100, 'allows_dwg' => true, 'allows_skp' => false, 'allows_ebooks' => false,
                'is_recommended' => false, 'highlight_color' => 'slate',
            ],
            [
                'slug' => 'pro', 'name' => 'Pro', 'level' => 2, 'price' => 29,
                'description' => 'La herramienta definitiva para el arquitecto.',
                'features' => ['Todo el catálogo', 'Todo lo del plan Estudiante', 'Modelos 3D de SketchUp (.SKP)', 'Biblioteca de ebooks técnicos', 'Soporte prioritario'],
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