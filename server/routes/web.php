<?php

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

Route::middleware(Language::class)->group(function () {
    Route::fallback([AppController::class, 'index']);


Route::get('/', function () {
    return view('index');
});
