<?php

namespace App\Lib\Utils;

use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class Numbers
{
    static function withBinUnitPrefix(float $size, int $precision = 2, string $before = '', string $behind = ''): string
    {
        return static::withUnitPrefix($size, $precision, $before, $behind, 1024);
    }

    static function withUnitPrefix(
        float $size,
        int $precision = 2,
        string $before = ' ',
        string $behind = '',
        int $base = 1000
    ): string {
        if ($size <= 0) {
            return 0;
        }
        return @round($size / pow($base, floor(log($size, $base))), $precision)
            . $before
            . static::unitPrefix($size, $base)
            . $behind;
    }

    static function unitPrefix(float $size, int $base = 1024): string
    {
        $unit = array('B', 'KB', 'MB', 'GB', 'TB', 'PB');
        $i = floor(log($size, $base));
        return $unit[$i];
    }

    static function getRealMemUsage(): int
    {
        if (!env('WITH_REAL_MEM_USAGE') && Str::startsWith(strtolower(PHP_OS), 'linux')) {
            return -1;
        }

        $cmd = Str::afterLast(PHP_BINARY, '/');
        $psEntries = new Collection();
        @exec(('ps -F -C ' . $cmd), $psOut, $exitCode); // list of processes for a given command
        if (!$exitCode && $psOut && is_array($psOut)) { // Output to array
            $head = null;
            foreach ($psOut as $line) {
                $row = preg_split('/\s+/', $line);
                if (!$head) {
                    $head = $row;
                } else {
                    $chopped = array_splice($row, count($head));
                    if (count($row)) {
                        $row[count($row) - 1] .= rtrim(' ' . implode(' ', $chopped));
                        $psEntries->push(array_combine($head, $row));
                    }
                }
            }
        }

        $size = 0;
        $commandLineCall = $cmd . ' ' . implode(' ', $_SERVER['argv']); // command line call to start this script
        $scriptPs = $psEntries->where('CMD', $commandLineCall)->first(
        );    // find entry of this script in the processes list
        if ($scriptPs) {
            $size = (float)$scriptPs['RSS'] * 1000;
        }

        return $size;
    }
}
