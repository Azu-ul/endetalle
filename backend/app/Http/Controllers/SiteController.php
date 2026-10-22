<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Plan;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class SiteController extends Controller
{
    public function settings(): JsonResponse
    {
        $settings = DB::table('settings')->pluck('value', 'key')->all();

        $settings['social_links'] = json_decode($settings['social_links'] ?? '{}', true) ?: (object) [];
        $settings['maintenance_mode'] = filter_var($settings['maintenance_mode'] ?? false, FILTER_VALIDATE_BOOLEAN);

        return response()->json($settings);
    }

    public function categories(): JsonResponse
    {
        $categories = Category::whereNull('parent_id')
            ->with('children')
            ->orderBy('sort_order')
            ->get()
            ->map(fn (Category $c) => [
                'id' => $c->id,
                'name' => $c->name,
                'slug' => $c->slug,
                'image_url' => $c->image_url,
                'subcategories' => $c->children->map(fn (Category $s) => [
                    'id' => $s->id,
                    'name' => $s->name,
                    'slug' => $s->slug,
                ])->values(),
            ]);

        return response()->json($categories);
    }

    public function plans(): JsonResponse
    {
        $plans = Plan::where('is_active', true)
            ->orderBy('level')
            ->get()
            ->map(fn (Plan $p) => [
                'id' => $p->id,
                'slug' => $p->slug,
                'name' => $p->name,
                'level' => $p->level,
                'price' => (float) $p->price,
                'price_ars' => $p->price_ars,
                'price_usd' => $p->price_usd,
                'periods' => $p->periodPrices(),
                'currency' => $p->currency,
                'interval' => $p->interval,
                'description' => $p->description,
                'features' => $p->features ?? [],
                'detail_limit' => $p->detail_limit,
                'allows_dwg' => $p->allows_dwg,
                'allows_skp' => $p->allows_skp,
                'allows_ebooks' => $p->allows_ebooks,
                'is_recommended' => $p->is_recommended,
                'highlight_color' => $p->highlight_color,
            ]);

        return response()->json($plans);
    }
}