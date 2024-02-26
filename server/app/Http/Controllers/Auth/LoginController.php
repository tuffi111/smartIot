<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers{
        sendLoginResponse as protected sendLoginResponseBase;
    }


    protected function sendLoginResponse(Request $request)
    {
        $this->sendLoginResponseBase($request);

        Auth::user()->tokens()->delete();
        $apiToken = Auth::user()->createToken('Laravel Password Grant Client')->accessToken;

        return new JsonResponse([
            'token' => $apiToken,
        ], 200);
    }
}
