<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $data = json_decode(file_get_contents(database_path('seeders/data/seed.json')), true);
        $now = now();

        // Categoría Premium: solo para el plan Pro (los detalles que se carguen ahí piden plan Pro)
        $categories = array_merge($data['categories'], [
            ['name' => 'Premium', 'imageUrl' => null, 'subcategories' => []],
        ]);

        foreach ($categories as $i => $cat) {
            $slug = Str::slug($cat['name']);

            $parentId = DB::table('categories')->whereNull('parent_id')->where('slug', $slug)->value('id');

            if (! $parentId) {
                $parentId = DB::table('categories')->insertGetId([
                    'name' => $cat['name'], 'slug' => $slug, 'image_url' => $cat['imageUrl'] ?? null,
                    'sort_order' => $i, 'created_at' => $now, 'updated_at' => $now,
                ]);
            }

            foreach ($cat['subcategories'] as $j => $sub) {
                DB::table('categories')->insertOrIgnore([
                    'parent_id' => $parentId, 'name' => $sub, 'slug' => Str::slug($sub),
                    'sort_order' => $j, 'created_at' => $now, 'updated_at' => $now,
                ]);
            }
        }
    }
}