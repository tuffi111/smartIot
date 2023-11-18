<?php


use App\Ziggy\AppRoute;

return [
    'only' => ['api.*'],
    'output' => [
        'script' => AppRoute::class,
    ]
];
