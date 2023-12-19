<?php

namespace App\Lib\Command;

use Exception;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

trait options
{
    use withConsole;

    function optionDate(
        string $option,
        Carbon|callable|null $default = null,
        string $format = 'Y-m-d'
    ): Carbon|null {
        $date = $this->optionNormalized($option);
        if (!$date) {
            return $this->resolveDefault($default, $date);
        }

        try {
            return Carbon::createFromFormat($format, $date);
        } catch (Exception $e) {
            $this->warn(sprintf('Date error for "--%s": "%s" raises: %s', $option, $date, $e->getMessage()));
            return $this->resolveDefault($default, $date);
        }
    }

    function optionString(string $option, string|callable|null $default = null): string|null
    {
        $value = $this->optionNormalized($option);

        if (is_null($value)) {
            $value = $this->resolveDefault($default, $value);
        }

        return $value;
    }


    function optionArray(
        string $option,
        array|Collection|callable $default = [],
        string $separator = ','
    ): array {
        $value = $this->option($option);

        if (!$value || (is_array($value) && !count($value))) {
            $value = $this->resolveDefault($default, $value);
            $value = implode($separator, Collection::make($value)->toArray());
        }

        // Explode string by $separator. Ignores whitespaces (' , ') and empty tokens.
        return array_filter(explode($separator, preg_replace('/\s+/', $separator, $value)));
    }

    function optionCollection(
        string $option,
        array|Collection|callable $default = [],
        string $separator = ','
    ): Collection {
        return Collection::make($this->optionArray($option, $default, $separator));
    }

    function optionBool(string $option, bool|callable|null $default = null): bool
    {
        $value = $this->optionNormalized($option);
        if (is_null($value)) {
            $value = $this->resolveDefault($default, $value);
        }
        return static::isTrue($value);
    }

    static function isTrue($value): bool
    {
        return ($value === true
            || (int)$value === 1
            || strtolower(trim($value)) === 'true'
            || strtolower(trim($value)) === 'on'
            || strtolower(trim($value)) === 'yes'
            || strtolower(trim($value)) === 'y'
        );
    }

    private function resolveDefault(mixed $default, $data): mixed
    {
        if (is_callable($default)) {
            return $default($data);
        }
        return $default;
    }

    private function optionNormalized(string $option): ?string
    {
        $value = $this->option($option);
        if (is_null($value)) {
            return null;
        }
        return trim($value);
    }
}
