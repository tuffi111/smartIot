<?php

use App\Http\Controllers\Api\Auth\ApiAuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Middleware\Cors;
use App\Http\Middleware\ForceJsonResponse;
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


//Auth::routes();

Route::middleware([
    Cors::class,
    ForceJsonResponse::class,
    //Language::class,
])->group(function () {
    //Route::put('login', [ApiAuthController::class, 'register'])->name('auth.api.register');
});


Route::middleware(['auth:api','web'])->group(function () {
    Route::get('logout', [ApiAuthController::class, 'logout'])->name('auth.api.logout');
    Route::get('permissions', [ApiAuthController::class, 'permissions'])->name('auth.api.permissions');
    Route::get('user/get', [UserController::class, 'get']);
});


/*
Route::prefix('api')
    ->name('api.')
    ->middleware(Language::class)
    ->group(function () {
        Route::prefix('user')
            ->name('user.')
            ->group(function () {
                //Route::get('login', [Location::class, 'detail'])->name('login');
            });
    });
/**/
