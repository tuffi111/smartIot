<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;


class ModelController extends ApiController
{
    private $data = [
        "theme" => 'ApiModel-theme-API REPONSE',

        /*
        "type" => 3,
        "address" => [
            "street" => 'ccc',
            "zip" => 'ccc333',
            "city" => 'ccc333ccc'
        ],
        "tags" => [
            'tag-3' => 'tag-3',
            'tag-33' => 'tag-33',
            'tag-333' => 'tag-333'
        ],
        /**/
        "rights" => ['read', 'write'],
        "time" => '13:00:00'
    ];

    function fetch(Request $request, string $model): JsonResponse
    {
        return new JsonResponse($this->data);
    }

    function update(Request $request, string $model): JsonResponse
    {
        //dd( $request->json(), $model );
        return new JsonResponse($request->merge($this->data));
    }
}
