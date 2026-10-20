<?php

namespace App\Services;

use App\Models\Detail;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DetailAccess
{
    private bool $loaded = false;
    private ?Subscription $subscription = null;
    private ?Plan $plan = null;

    public function __construct(private ?User $user)
    {
    }

    private function load(): void
    {
        if ($this->loaded) {
            return;
        }

        $this->subscription = $this->user?->currentSubscription();
        $this->plan = $this->subscription?->plan ?? Plan::where('slug', 'free')->first();
        $this->loaded = true;
    }

    public function plan(): ?Plan
    {
        $this->load();

        return $this->plan;
    }

    public function isStaff(): bool
    {
        return $this->user?->hasAnyRole(['superadmin', 'colaborador']) ?? false;
    }

    /** Nivel con el que se ve el catálogo: 99 staff, 0 visitante, nivel del plan si hay sesión. */
    public function effectiveLevel(): int
    {
        if ($this->isStaff()) {
            return 99;
        }

        if (! $this->user) {
            return 0;
        }

        return $this->plan()?->level ?? 0;
    }

    public function quotaLimit(): ?int
    {
        return $this->plan()?->detail_limit;
    }

    public function quotaUsed(): int
    {
        if (! $this->user) {
            return 0;
        }

        $this->load();

        $query = DB::table('detail_views')->where('user_id', $this->user->id);

        if ($this->subscription?->starts_at) {
            $query->where('first_viewed_at', '>=', $this->subscription->starts_at);
        }

        return $query->count();
    }

    /** @return array{allowed: bool, reason: ?string} */
    public function check(Detail $detail): array
    {
        if ($this->isStaff()) {
            return ['allowed' => true, 'reason' => null];
        }

        if (! $this->user) {
            return ['allowed' => false, 'reason' => 'login'];
        }

        $required = $detail->requiredPlan?->level ?? 0;
        if ($this->effectiveLevel() < $required) {
            return ['allowed' => false, 'reason' => 'plan'];
        }

        $limit = $this->quotaLimit();
        if ($limit !== null && ! $this->alreadyViewed($detail) && $this->quotaUsed() >= $limit) {
            return ['allowed' => false, 'reason' => 'quota'];
        }

        return ['allowed' => true, 'reason' => null];
    }

    public function canDownload(string $type): bool
    {
        if ($this->isStaff()) {
            return true;
        }

        if (! $this->user) {
            return false;
        }

        return match ($type) {
            'dwg' => (bool) $this->plan()?->allows_dwg,
            'skp' => (bool) $this->plan()?->allows_skp,
            default => false,
        };
    }

    public function recordView(Detail $detail): void
    {
        if (! $this->user || $this->isStaff()) {
            return;
        }

        DB::table('detail_views')->insertOrIgnore([
            'user_id' => $this->user->id,
            'detail_id' => $detail->id,
            'first_viewed_at' => now(),
        ]);
    }

    private function alreadyViewed(Detail $detail): bool
    {
        return DB::table('detail_views')
            ->where('user_id', $this->user->id)
            ->where('detail_id', $detail->id)
            ->exists();
    }
}