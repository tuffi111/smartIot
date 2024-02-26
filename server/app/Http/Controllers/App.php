<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\Auth;

class App extends Controller
{
    function index(): View
    {
        if (Auth::guest()) {
            return view('index', ['auth' => null]);
        } else {
            return view('index', ['auth' => ['user' => Auth::user()]]);
        }
    }
}
