<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment('local')) {
            $this->command->warn('DemoSeeder solo corre en entorno local.');
            return;
        }

        $data = json_decode(file_get_contents(database_path('seeders/data/seed.json')), true);
        $now = now();
        $planIds = DB::table('plans')->pluck('id', 'slug');

        foreach ($data['tags'] as $tag) {
            $this->makeTag($tag);
        }

        // Autores = colaboradores
        $authorIds = [];
        foreach ($data['details'] as $d) {
            $a = $d['author'];
            $authorIds[$a['name']] ??= $this->makeUser(
                $a['name'], Str::slug($a['name']) . '@demo.endetalle.test', 'colaborador',
                ['avatar_url' => $a['avatarUrl'] ?? null, 'profession' => $a['role'] ?? null, 'company' => $a['team'] ?? null]
            );
        }

        // Usuarios comunes y suscripciones
        foreach ($data['clients'] as $c) {
            $userId = $this->makeUser($c['name'], $c['email'], 'usuario', [
                'avatar_url' => $c['avatarUrl'] ?? null,
                'profession' => $c['profession'] ?? null,
                'bio' => $c['bio'] ?? null,
                'interests' => isset($c['interests']) ? json_encode($c['interests'], JSON_UNESCAPED_UNICODE) : null,
            ]);

            if (($c['plan'] ?? '') === 'Pro') {
                DB::table('subscriptions')->updateOrInsert(
                    ['user_id' => $userId, 'plan_id' => $planIds['pro']],
                    [
                        'status' => 'active', 'provider' => 'manual',
                        'starts_at' => $c['subscriptionStart'] ?? $now,
                        'ends_at' => $now->copy()->addDays(30),
                        'created_at' => $now, 'updated_at' => $now,
                    ]
                );
            }
        }

        // Detalles
        $detailIds = [];
        foreach ($data['details'] as $d) {
            $categoryId = DB::table('categories')->whereNull('parent_id')->where('name', $d['category'])->value('id');
            $subId = isset($d['subcategory'])
                ? DB::table('categories')->where('parent_id', $categoryId)->where('name', $d['subcategory'])->value('id')
                : null;

            DB::table('details')->updateOrInsert(['slug' => $d['slug']], [
                'title' => $d['title'],
                'description' => $d['description'],
                'category_id' => $categoryId,
                'subcategory_id' => $subId,
                'author_id' => $authorIds[$d['author']['name']],
                'required_plan_id' => ($d['accessLevel'] ?? 'Public') === 'Public' ? null : $planIds['pro'],
                'status' => strtolower($d['status'] ?? 'published'),
                'cover_url' => $d['imageUrl'] ?? null,
                'specs' => json_encode($d['specs'] ?? [], JSON_UNESCAPED_UNICODE),
                'materials' => json_encode($d['materials'] ?? [], JSON_UNESCAPED_UNICODE),
                'is_verified' => (bool) ($d['isVerified'] ?? false),
                'votes_count' => $d['likes'] ?? 0,
                'published_at' => $d['publishedDate'] ?? $now,
                'created_at' => $now, 'updated_at' => $now,
            ]);

            $detailId = DB::table('details')->where('slug', $d['slug'])->value('id');
            $detailIds[$d['id']] = $detailId;

            DB::table('detail_images')->where('detail_id', $detailId)->delete();
            foreach (($d['drawings'] ?? []) as $i => $img) {
                DB::table('detail_images')->insert([
                    'detail_id' => $detailId, 'type' => strtolower($img['type'] ?? 'detail'),
                    'url' => $img['url'], 'caption' => $img['caption'] ?? null,
                    'sort_order' => $i, 'created_at' => $now, 'updated_at' => $now,
                ]);
            }

            foreach (($d['tags'] ?? []) as $tag) {
                DB::table('detail_tag')->insertOrIgnore([
                    'detail_id' => $detailId, 'tag_id' => $this->makeTag($tag),
                ]);
            }
        }

        // Reportes de error
        foreach ($data['reports'] as $r) {
            if (! isset($detailIds[$r['detailId']])) {
                continue;
            }
            DB::table('error_reports')->updateOrInsert(
                ['detail_id' => $detailIds[$r['detailId']], 'description' => $r['description']],
                ['status' => strtolower($r['status']), 'created_at' => $r['submittedAt'] ?? $now, 'updated_at' => $now]
            );
        }

        // Comentarios
        foreach ($data['comments'] as $c) {
            if (! isset($detailIds[$c['detailId']])) {
                continue;
            }
            $userId = $this->makeUser(
                $c['authorName'], Str::slug($c['authorName']) . '@demo.endetalle.test', 'usuario',
                ['avatar_url' => $c['authorAvatar'] ?? null]
            );
            DB::table('comments')->updateOrInsert(
                ['detail_id' => $detailIds[$c['detailId']], 'user_id' => $userId, 'body' => $c['text']],
                ['created_at' => $now, 'updated_at' => $now]
            );
        }
    }

    private function makeUser(string $name, string $email, string $role, array $extra = []): int
    {
        $user = User::firstOrNew(['email' => $email]);
        $user->forceFill(array_merge([
            'name' => $name,
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ], $extra))->save();
        $user->syncRoles([$role]);

        return $user->id;
    }

    private function makeTag(string $name): int
    {
        DB::table('tags')->insertOrIgnore([
            'name' => $name, 'slug' => Str::slug($name),
            'created_at' => now(), 'updated_at' => now(),
        ]);

        return DB::table('tags')->where('name', $name)->value('id');
    }
}