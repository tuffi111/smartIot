<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class UserController extends ApiController
{
    function get(Request $request)
    {
        /* todo: provide settings associated with api-token:
            Mee/Config::get(''); // Merged settings (wl->com->pl->user)
            Mee/User::config(''); // User Settings
            Mee/Pl::config(''); // Privatelable Settings
            Mee/Company::config(''); // Company settings
            Mee/Wl::config(''); // Whitelable settings (server/instance settings?)
            Mee/Lang::translate('');
        /**/

        $user_id = Auth::id();

        $user = User::find($user_id);

        return $user;
    }
}
