<?php

namespace App\Http\Resources;

use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Services\DetailAccess;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $subscription = $this->currentSubscription();
        $plan = $subscription?->plan ?? Plan::where('slug', 'free')->first();
        $endsAt = $subscription?->ends_at;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'avatar_url' => $this->avatar_url,
            'cover_url' => $this->cover_url,
            'profession' => $this->profession,
            'company' => $this->company,
            'bio' => $this->bio,
            'birth_date' => $this->birth_date?->toDateString(),
            'interests' => $this->interests ?? [],
            'portfolio_url' => $this->portfolio_url,
            'roles' => $this->getRoleNames()->values(),
            'plan' => [
                'slug' => $plan->slug,
                'name' => $plan->name,
                'level' => $plan->level,
                'detail_limit' => $plan->detail_limit,
                'allows_dwg' => (bool) $plan->allows_dwg,
                'allows_skp' => (bool) $plan->allows_skp,
                'allows_ebooks' => (bool) $plan->allows_ebooks,
            ],
            'quota' => [
                'used' => (new DetailAccess($this->resource))->quotaUsed(),
                'limit' => $plan->detail_limit,
            ],
            'subscription' => $subscription ? [
                'status' => $subscription->status,
                'starts_at' => $subscription->starts_at?->toIso8601String(),
                'ends_at' => $endsAt?->toIso8601String(),
                'days_left' => $endsAt
                    ? max(0, (int) ceil(($endsAt->getTimestamp() - now()->getTimestamp()) / 86400))
                    : null,
            ] : null,
        ];
    }
}
