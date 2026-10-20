<?php

namespace App\Http\Controllers;

use App\Models\Detail;
use App\Services\DetailAccess;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DetailController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $level = (new DetailAccess($request->user('sanctum')))->effectiveLevel();

        $query = $this->baseQuery();

        if ($category = $request->query('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $category));
        }

        if ($subcategory = $request->query('subcategory')) {
            $query->whereHas('subcategory', fn ($q) => $q->where('slug', $subcategory));
        }

        $term = trim((string) $request->query('q', ''));
        if ($term !== '') {
            $like = '%' . str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], $term) . '%';
            $query->where(fn ($q) => $q->where('title', 'like', $like)->orWhere('description', 'like', $like));
        }

        if ($request->query('sort') === 'date') {
            $query->orderByDesc('published_at')->orderByDesc('id');
        } else {
            $query->orderByDesc('votes_count')->orderByDesc('id');
        }

        $perPage = min(max((int) $request->query('per_page', 24), 1), 100);

        $page = $query->paginate($perPage)->through(fn (Detail $d) => $this->card($d, $level));

        return response()->json($page);
    }

    public function show(Request $request, string $slug): JsonResponse
    {
        $detail = $this->baseQuery()->with(['images', 'files'])->where('slug', $slug)->firstOrFail();

        $access = new DetailAccess($request->user('sanctum'));
        $decision = $access->check($detail);
        $level = $access->effectiveLevel();

        $payload = $this->card($detail, $level) + ['access' => $decision];

        // Vista previa: sin especificaciones, materiales, imágenes ni archivos.
        if (! $decision['allowed']) {
            $payload['description'] = Str::limit($detail->description, 200);

            return response()->json($payload);
        }

        $access->recordView($detail);

        $related = $this->baseQuery()
            ->where('category_id', $detail->category_id)
            ->where('id', '!=', $detail->id)
            ->orderByDesc('votes_count')
            ->limit(4)
            ->get()
            ->map(fn (Detail $d) => $this->card($d, $level));

        return response()->json($payload + [
            'specs' => $detail->specs ?? [],
            'materials' => $detail->materials ?? [],
            'images' => $detail->images->map(fn ($i) => [
                'type' => $i->type,
                'url' => $i->url,
                'caption' => $i->caption,
            ])->values(),
            'files' => $detail->files->map(fn ($f) => [
                'type' => $f->type,
                'can_download' => $access->canDownload($f->type),
            ])->values(),
            'seo_title' => $detail->seo_title,
            'meta_description' => $detail->meta_description,
            'related' => $related,
        ]);
    }

    private function baseQuery(): Builder
    {
        return Detail::published()->with([
            'category:id,name,slug',
            'subcategory:id,name,slug',
            'author:id,name,avatar_url,profession,company',
            'requiredPlan:id,slug,name,level',
            'tags:id,name,slug',
        ]);
    }

    private function card(Detail $d, int $viewerLevel): array
    {
        $required = $d->requiredPlan?->level ?? 0;

        return [
            'id' => $d->id,
            'slug' => $d->slug,
            'title' => $d->title,
            'description' => $d->description,
            'cover_url' => $d->cover_url,
            'category' => $d->category?->only(['id', 'name', 'slug']),
            'subcategory' => $d->subcategory?->only(['id', 'name', 'slug']),
            'author' => $d->author?->only(['id', 'name', 'avatar_url', 'profession', 'company']),
            'tags' => $d->tags->pluck('name')->values(),
            'is_verified' => $d->is_verified,
            'votes_count' => $d->votes_count,
            'published_at' => $d->published_at?->toDateString(),
            'required_plan' => $d->requiredPlan?->only(['slug', 'name', 'level']),
            'locked' => $required > $viewerLevel,
        ];
    }
}