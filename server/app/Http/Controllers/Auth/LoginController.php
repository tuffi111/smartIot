<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\AuthResource;
use Illuminate\Auth\SessionGuard;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MeeGuard extends SessionGuard
{


}

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

    use AuthenticatesUsers {
        logout as logoutBase;
    }


    protected function guard()
    {
        return Auth::guard();
    }

    protected function authenticated(Request $request, $user)
    {
        //todo: do not revoke to much
        $user->tokens()->delete();
        return AuthResource::byUser($user)->additional([
            'token' => $user->createToken('Laravel Password Grant Client')->accessToken,
        ]);
    }


    public function logout(Request $request)
    {
        if ($request->user()) {
            //todo: do nit revoke to much
            $request->user()->tokens()->delete();
        }
        return $this->logoutBase($request);
    }

    protected function loggedOut(Request $request)
    {
        return redirect('/');

    }

    function permissions(Request $request)
    {
        return AuthResource::byUser($request->user());
    }
}
