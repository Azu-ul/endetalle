<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $data = json_decode(file_get_contents(database_path('seeders/data/seed.json')), true);
        $config = $data['config'] + ['address' => 'BUA - Buenos Aires'];

        foreach ($config as $key => $value) {
            DB::table('settings')->insertOrIgnore([
                'key' => Str::snake($key),
                'value' => is_scalar($value) && ! is_bool($value) ? (string) $value : json_encode($value, JSON_UNESCAPED_UNICODE),
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }
    }
}