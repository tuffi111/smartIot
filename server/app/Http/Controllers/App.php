<?php

namespace App\Http\Controllers;

use App\Http\Resources\AuthResource;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class App extends Controller
{
    function index(Request $request): View
    {
        return view('index', ['auth' => AuthResource::byUser($request->user())->toJson() ]);
    }
}
