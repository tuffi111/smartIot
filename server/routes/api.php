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


Route::middleware([
    Cors::class,
    ForceJsonResponse::class,
    //Language::class,
])->group(function () {
    Route::post('/register', [ApiAuthController::class, 'register'])->name('register.api');
    Route::post('/login', [ApiAuthController::class, 'login'])->name('login.api');
});


Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [ApiAuthController::class, 'logout'])->name('logout.api');

    Route::get('/user/get', [UserController::class, 'get']);
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
