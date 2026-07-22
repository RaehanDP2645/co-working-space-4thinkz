<?php

use App\Http\Controllers\Admin\FasilitasController as AdminFasilitasController;
use App\Http\Controllers\Admin\RuanganController as AdminRuanganController;
use App\Http\Controllers\Api\Admin\AdminBookingController;
use App\Http\Controllers\Api\Admin\AdminController;
use App\Http\Controllers\Api\Admin\AdminCustomerController;
use App\Http\Controllers\Api\Admin\AdminPaymentController;
use App\Http\Controllers\Api\FasilitasController;
use App\Http\Controllers\Api\RuanganController;
use App\Http\Controllers\Api\PaywuzController;
use App\Http\Controllers\Api\PemesananController;
use App\Http\Controllers\Api\AssistantController;
use App\Http\Controllers\Api\RekomendasiController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth:sanctum');
Route::post('/auth/exchange', [GoogleAuthController::class, 'exchange']);

Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/user/password', [UserController::class, 'updatePassword']);
    Route::put('/user', [UserController::class, 'updateProfile']);
    Route::post('/user/avatar', [UserController::class, 'uploadAvatar']);
});

Route::get('/rooms', [RuanganController::class, 'index']);
Route::get('/rooms/{ruangan}', [RuanganController::class, 'show']);
Route::get('/facilities', [FasilitasController::class, 'index']);
Route::get('/facilities/{fasilitas}', [FasilitasController::class, 'show']);

/*
| Rekomendasi Ruangan (Expert System - Forward Chaining)
*/
Route::post('/rekomendasi', [RekomendasiController::class, 'recommend']);

/*
| Asisten AI (OpenClaw)
*/
Route::post('/assistant/chat', [AssistantController::class, 'chat']);
Route::get('/rekomendasi/history', [RekomendasiController::class, 'history'])
    ->middleware('auth:sanctum');

/*
| PayWuzz Payment Gateway
*/
Route::middleware('api.auth')->prefix('payments')->group(function () {
    Route::get('/methods', [PaywuzController::class, 'paymentMethods']);
    Route::post('/create', [PaywuzController::class, 'createTransaction']);
    Route::get('/{orderId}', [PaywuzController::class, 'getTransaction']);
    Route::post('/{orderId}/simulate', [PaywuzController::class, 'simulatePayment']);
});
Route::post('/payments/callback', [PaywuzController::class, 'callback']);
Route::middleware('api.auth')->prefix('pemesanan')->group(function () {
    Route::get('/', [PemesananController::class, 'index']);
    Route::post('/', [PemesananController::class, 'store']);
    Route::get('/{pemesanan}', [PemesananController::class, 'show']);
    Route::delete('/{pemesanan}', [PemesananController::class, 'destroy']);
});

/*
| Admin Auth (publik)
*/
Route::post('/admin/login', [AdminController::class, 'login']);

/*
| Admin Panel (butuh auth + admin)
*/
Route::middleware(['auth:sanctum', 'admin'])
    ->prefix('admin')
    ->group(function () {
        Route::get('/me', [AdminController::class, 'me']);
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/reports', [AdminController::class, 'reports']);

        Route::apiResource('ruangan', AdminRuanganController::class);
        Route::apiResource('fasilitas', AdminFasilitasController::class);

        Route::get('/bookings', [AdminBookingController::class, 'index']);
        Route::post('/bookings/{id}/status', [AdminBookingController::class, 'updateStatus']);
        Route::post('/bookings/{id}/cancel', [AdminBookingController::class, 'cancel']);

        Route::get('/payments', [AdminPaymentController::class, 'index']);
        Route::post('/payments/{id}/verify', [AdminPaymentController::class, 'verify']);

        Route::get('/customers', [AdminCustomerController::class, 'index']);
    });
