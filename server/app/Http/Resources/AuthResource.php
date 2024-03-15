<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuthResource extends JsonResource
{

    static function byUser($user)
    {
        return new static([
            'isAuth' => !!$user,
            'user' => $user??null,
            'permissions' => $user?$user->permissions()->get():[],
        ]);
    }

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return parent::toArray($request);
    }
}
