<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        foreach (['superadmin', 'colaborador', 'usuario'] as $name) {
            Role::findOrCreate($name, 'web');
        }

        $email = env('ADMIN_EMAIL');
        $password = env('ADMIN_PASSWORD');

        if (! $email || ! $password) {
            $this->command->error('Definí ADMIN_EMAIL y ADMIN_PASSWORD en el .env');
            return;
        }

        $admin = User::firstOrCreate(
            ['email' => $email],
            ['name' => 'Administrador', 'password' => Hash::make($password)]
        );

        $admin->assignRole('superadmin');
    }
}