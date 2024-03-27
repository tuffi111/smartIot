<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuthResource extends JsonResource
{

    static function byUser(User|null $user): self
    {
        return new static([
            'auth' => (($user) ? [
                'user' => $user,
                'permissions' => $user->permissions()->get(),
            ] : null)
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
