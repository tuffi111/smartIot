<?php

namespace App\Lib;

use Illuminate\Support\Collection;

trait Config
{
    private ?Collection $config = null;

    function config(string|array $key, mixed $set = null, mixed $default = null): mixed
    {
        if (!$this->config) {
            $this->config = new Collection();
        }

        if (is_null($set)) {
            if (is_array($key)) {
                $this->config = $this->config->merge($key);
                return $this;
            } else {
                if (!$this->config->has($key)) {
                    $this->config->put($key, is_callable($default) ? $default($this) : $default);
                }
                return $this->config->get($key);
            }
        }

        $this->config->put($key, $set);
        return $this;
    }
}
