<?php


use App\Ziggy\AppRoute;

return [
    'only' => ['api.*','auth.*'],
    'output' => [
        'script' => AppRoute::class,
    ]
];
