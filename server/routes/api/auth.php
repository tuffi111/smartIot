<?php

use App\Http\Controllers\Api\Auth\ApiAuthController;
use Illuminate\Support\Facades\Route;


Route::get('logout', [ApiAuthController::class, 'logout'])->name('logout');
Route::get('permissions', [ApiAuthController::class, 'permissions'])->name('permissions');

