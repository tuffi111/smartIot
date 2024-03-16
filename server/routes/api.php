<?php

use App\Http\Controllers\Api\UserController;
use App\Http\Middleware\ForceJsonResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


Route::fallback(function () {
    return new JsonResponse([
        'state' => 'error',
        'message' => 'Unknown api route',
        'errors' => ['request' => 'Unknown api route']
    ], 404);
})->name('index');

//Auth::routes();

// api
Route::name('api.')
    ->middleware([ForceJsonResponse::class /*,Language::class*/])
    ->group(function () {
        // api.auth
        Route::name('auth.')
            ->prefix('auth')
            ->middleware(['auth:api', 'web'])
            ->group(function () {
                require('api/auth.php');
            });

        // api.models
        Route::name('models.')
            ->prefix('models')
            ->middleware(['auth:api', 'web'])
            ->group(function () {
                require('api/models.php');
            });


        Route::name('users.')
            ->prefix('users')
            ->middleware(['auth:api', 'web'])
            ->group(function () {
                Route::get('fetch', [UserController::class, 'fetch'])->name('fetch');
                Route::post('update', [UserController::class, 'update'])->name('update');

            });
    });
