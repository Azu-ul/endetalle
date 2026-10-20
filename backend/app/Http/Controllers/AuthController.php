<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'max:72'],
            'profession' => ['nullable', 'string', 'max:255'],
            'birth_date' => ['nullable', 'date', 'before:today'],
            'interests' => ['nullable', 'array'],
            'interests.*' => ['string', 'max:100'],
        ], [
            'name.required' => 'Ingresá tu nombre.',
            'email.required' => 'Ingresá tu email.',
            'email.email' => 'El email no es válido.',
            'email.unique' => 'Ese email ya está registrado.',
            'password.required' => 'Ingresá una contraseña.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'birth_date.before' => 'La fecha de nacimiento no es válida.',
        ]);

        $user = User::create([...$data, 'password' => Hash::make($data['password'])]);
        $user->assignRole('usuario');

        Auth::login($user);
        $request->session()->regenerate();

        return response()->json(UserResource::make($user), 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ], [
            'email.required' => 'Ingresá tu email.',
            'email.email' => 'El email no es válido.',
            'password.required' => 'Ingresá tu contraseña.',
        ]);

        if (! Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['Email o contraseña incorrectos.'],
            ]);
        }

        if (Auth::user()->status !== 'active') {
            Auth::logout();
            throw ValidationException::withMessages([
                'email' => ['Tu cuenta está suspendida. Contactá al administrador.'],
            ]);
        }

        $request->session()->regenerate();

        return response()->json(UserResource::make($request->user()));
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Sesión cerrada.']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(UserResource::make($request->user()));
    }
}