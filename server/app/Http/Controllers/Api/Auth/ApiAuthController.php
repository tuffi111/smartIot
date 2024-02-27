<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\UnauthorizedException;
use Laravel\Passport\Passport;

class ApiAuthController extends Controller
{

    function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);
        if ($validator->fails()) {
            return response(['errors' => $validator->errors()->all()], 422);
        }

        $request['password'] = Hash::make($request['password']);
        $request['remember_token'] = Str::random(10);
        $user = User::create($request->toArray());
        $token = $user->createToken('Laravel Password Grant Client');

        $response = ['token' => $token->accessToken];

        return response($response, 200);
    }

    function logout(Request $request)
    {
        Auth::user()->token()->revoke();
        Auth::guard('web')->logout();
        return new JsonResponse(null, 200);
    }


    function permissions(Request $request)
    {
        return new JsonResponse(Auth::user()->permissions()->get());
    }
}
