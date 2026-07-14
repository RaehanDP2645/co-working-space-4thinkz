<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\RuanganController;

Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth:sanctum');
Route::post('/auth/exchange', [GoogleAuthController::class, 'exchange']);

Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback']);

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/rooms', [RuanganController::class, 'index']);
Route::get('/rooms/{ruangan}', [RuanganController::class, 'show']);

Route::middleware('auth:sanctum')
    ->prefix('admin')
    ->group(function(){

        Route::apiResource(
            'ruangan',
            \App\Http\Controllers\Admin\RuanganController::class
        );
});
