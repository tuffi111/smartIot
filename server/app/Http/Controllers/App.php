<?php

namespace App\Http\Controllers;

use App\Http\Resources\AuthResource;
use App\Models\Hierarchy;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class App extends Controller
{
    function index(Request $request): View
    {
        /*
        dd(
            //Hierarchy::parents(6)->dump(),
            //Hierarchy::parents(6)->get()->toArray(),

            //Hierarchy::children(5)->dump(),
            //Hierarchy::children(5)->get()->toArray(),

            //Hierarchy::addAfter(1,'SUB ROUTE 1'),
            //Hierarchy::addTo(3,'NEW ENTRY 2'),

            Hierarchy::depth()->get()->toArray(),
        );
        /**/

        return view('index', ['auth' => AuthResource::byUser(Auth::user())]);
        //return view('index', ['auth' => AuthResource::byUser($request->user())->toJson() ]);
    }
}
