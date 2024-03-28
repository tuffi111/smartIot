<?php

namespace App\Models\Passport;

use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Laravel\Passport\Client as BaseClient;
use Spatie\Permission\Traits\HasRoles;

class Client extends BaseClient implements AuthorizableContract
{
    use HasRoles;
    use Authorizable;

    public function guardName()
    {
        return 'api';
    }

    /**
     * Determine if the client should skip the authorization prompt.
     */
    public function skipsAuthorization(): bool
    {
        //return true;
        return $this->firstParty();
    }
}
