<?php


namespace App\Lib\Utils\Zipper;


use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Support\Collection;

abstract class ZipperAbstract implements ZipperContract
{
    private string $password;
    private ?Collection $source = null;
    private string $target;

    function password(string $set = null): string|null|self
    {
        if ($set) {
            $this->password = $set;
            return $this;
        }

        return $this->password;
    }

    function source(array|Arrayable|string $set = null, string $name = null): Collection|self
    {
        if (is_null($set)) {
            return $this->source;
        }

        if (!$this->source) {
            $this->source = new Collection();
        }

        if (is_scalar($set)) {
            if (!$name) {
                $name = basename($set);
            }

            $this->source->put($set, $name);
        } else {
            $this->source = Collection::make($set);
        }

        return $this;
    }

    function target(string $set = null): string|self
    {
        if ($set) {
            $this->target = $set;
            return $this;
        }
        if (!$this->target) {
            $this->target = $this->source()->keys()->first() . '.zip';
        }

        return $this->target;
    }
}
