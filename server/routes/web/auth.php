<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Route;

//Auth::routes();
Route::post('login', [LoginController::class, 'login'])->name('login');
Route::put('login', [RegisterController::class, 'register'])->name('register');
Route::get('logout', [LoginController::class, 'logout'])->name('logout');
