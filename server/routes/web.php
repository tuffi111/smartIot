<?php

use App\Http\Middleware\ForceJsonResponse;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\App as AppController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

//Route::middleware(Language::class)->group(function () {
Route::fallback([AppController::class, 'index'])->name('index');

// todo: implement "about:version" route to get deployed app infos

//Auth::routes();
Route::middleware([
    ForceJsonResponse::class,
    //Language::class,
])->group(function () {
    Route::post('login', [App\Http\Controllers\Auth\LoginController::class, 'login'])->name('auth.login');
    Route::put('login', [App\Http\Controllers\Auth\RegisterController::class, 'register'])->name('auth.register');
    Route::get('logout', [App\Http\Controllers\Auth\LoginController::class, 'logout'])->name('auth.logout');
});






