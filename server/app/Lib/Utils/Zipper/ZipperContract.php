<?php


namespace App\Lib\Utils\Zipper;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Support\Collection;

interface ZipperContract
{
    function password(string $set = null): string|null|self;

    function source(array|Arrayable|string $set = null, string $name = null): Collection|self;

    function target(string $set = null): string|self;

    function compress(): self;
}
