<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;

class AuthResource extends JsonResource
{
    static function byUser(User|null $user): self
    {
        return new static([
            'auth' => (($user) ? [
                'user' => Collection::make($user->withoutRelations()->toArray())->only(User::PRP_NAME, User::PRP_EMAIL),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ] : null)
        ]);
    }
}
