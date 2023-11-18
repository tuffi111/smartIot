<?php

namespace App\Lib\Command;

use Exception;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

trait options{
    protected function optionDate(string $option, $default = null, string $format = 'Y-m-d')
    {
        $date = $this->optionNormalized($option);
        if (!$date) {
            return $this->resolveDefault($default, $date);
        }

        try {
            return Carbon::createFromFormat($format, $date);
        } catch (Exception $e) {
            $this->warn(sprintf('Date error for "--%s": "%s" causes: %s', $option, $date, $e->getMessage()));
            return $this->resolveDefault($default, $date);
        }
    }

    protected function optionString(string $option, $default = null)
    {
        $value = $this->optionNormalized($option);

        if (is_null($value)) {
            $value = $this->resolveDefault($default, $value);
        }

        return $value;
    }

    protected function optionArray(string $option, $default = [], string $separator = ','): array
    {
        $value = $this->option($option);

        if (!$value || (is_array($value) && !count($value))) {
            $value = $this->resolveDefault($default, $value);
            $value = implode($separator, Collection::make($value)->toArray());
        }

        // Explode string by $separator. Ignores whitespaces (' , ') and empty tokens.
        return array_filter(explode($separator, preg_replace('/\s+/', $separator, $value)));
    }

    protected function optionCollection(
        string $option,
        $default = [],
        string $separator = ','
    ): Collection {
        return Collection::make($this->optionArray($option, $default, $separator));
    }

    protected function optionBool(string $option, $default = null): bool
    {
        $value = $this->optionNormalized($option);
        if (is_null($value)) {
            $value = $this->resolveDefault($default, $value);
        }
        return static::isTrue($value);
    }

    protected static function isTrue($value): bool
    {
        return ($value === true
            || (int)$value === 1
            || strtolower(trim($value)) === 'true'
            || strtolower(trim($value)) === 'on'
            || strtolower(trim($value)) === 'yes'
            || strtolower(trim($value)) === 'y'
        );
    }

    private function resolveDefault($default, $data)
    {
        if (is_callable($default)) {
            return $default($data);
        }
        return $default;
    }

    private function optionNormalized(string $option)
    {
        $value = $this->option($option);
        if (is_null($value)) {
            return null;
        }
        return trim($value);
    }


}
