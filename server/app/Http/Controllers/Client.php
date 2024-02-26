<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class Client extends Controller
{
    static $clientid = '9b6c5048-f721-41e5-b6b9-d3a67a3db907';
    static $clientsecret = 'm6F3f3yk9r0y9EQ2Sfym6Gz5J5HeIb0scUlzM8Nr';
    private static $domain = 'http://smart-server.test';


    function client(Request $request)
    {
        dd('CLIENT');

        $state = $request->session()->pull('state');

        throw_unless(
            strlen($state) > 0 && $state === $request->state,
            \InvalidArgumentException::class,
            'Invalid state value.'
        );

        $response = Http::asForm()->post('http://passport-app.test/oauth/token', [
            'grant_type' => 'authorization_code',
            'client_id' => self::$clientid,
            'client_secret' => self::$clientsecret,
            'redirect_uri' => self::$domain . '/callback',
            'code' => $request->code,
        ]);

        return $response->json();
    }

    function auth(Request $request)
    {
        $request->session()->put('state', $state = Str::random(40));

        $query = http_build_query([
            'client_id' => self::$clientid,
            'client_secret' => self::$clientsecret,
            'redirect_uri' => self::$domain .'/client',
            'response_type' => 'code',
            'scope' => '',
            'state' => $state,
            // 'prompt' => '', // "none", "consent", or "login"
        ]);
        return redirect(self::$domain . '/oauth/authorize?' . $query);
    }
}
