<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;


class ModelController extends ApiController
{
    function fetch(Request $request, string $model)
    {
        return new JsonResponse([
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
        ]);
    }

    function update(Request $request, string $model)
    {
        //dd( $request->json() );
        return new JsonResponse($request);
    }
}
