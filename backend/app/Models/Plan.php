<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'allows_dwg' => 'boolean',
            'allows_skp' => 'boolean',
            'allows_ebooks' => 'boolean',
            'is_recommended' => 'boolean',
            'is_active' => 'boolean',
        ];
    }
}