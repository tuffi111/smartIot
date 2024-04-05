<?php

use App\Http\Controllers\Api\ModelController;
use Illuminate\Support\Facades\Route;

Route::get('{model}', [ModelController::class, 'fetch'])->name('fetch');
Route::post('{model}', [ModelController::class, 'update'])->name('update');
Route::delete('{model}', [ModelController::class, 'delete'])->name('delete');

