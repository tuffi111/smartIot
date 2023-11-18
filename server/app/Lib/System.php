<?php

namespace App\Lib;

use Exception;
use Illuminate\Support\Facades\File;

class System
{
    static ?array $result;
    static ?int $code;

    /**
     * @throws Exception
     */
    static function exec(string $cmd, ...$args): self
    {
        static::$result = null;
        static::$code = null;

        if ($args) {
            $cmd = sprintf($cmd, ...$args);
        }

        if ($repos = static::inDir()) {
            if (File::exists($repos)) {
                $repos = sprintf("cd %s &&", $repos);
            } else {
                throw new Exception(sprintf('Unknown folder for shell execution: %s', $repos));
            }
        }

        $run = trim(sprintf("%s %s", $repos, $cmd));
        //echo "-> run command: $run\n";
        exec($run, static::$result, static::$code);

        if (!is_array(static::$result)) {
            static::$result = [static::$result];
        }

        if (static::$code) {
            throw new Exception("Error executing '$cmd' (" . static::$code . "): " . implode(PHP_EOL, static::$result));
        }

        return new static;
    }

    static function script(string $cmd, ...$args): self
    {
        static::$result = null;
        static::$code = null;

        if ($args) {
            $cmd = sprintf($cmd, ...$args);
        }

        if ($repos = static::inDir()) {
            if (File::exists($repos)) {
                $cmd = ltrim($cmd, DIRECTORY_SEPARATOR);
                $cmd = ltrim($cmd, './');
                $cmd = rtrim($repos, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $cmd;
                $repos = sprintf("cd %s &&", $repos);
            } else {
                throw new Exception(sprintf('Unknown folder for shell execution: %s', $repos));
            }
        } else {
            $cmd = './' . ltrim($cmd, './');
        }

        $run = trim(sprintf("%s %s", $repos, $cmd));
        //echo "-> run script: $run\n";
        exec($run, static::$result, static::$code);

        if (!is_array(static::$result)) {
            static::$result = [static::$result];
        }

        if (static::$code) {
            throw new Exception("Error executing '$cmd' (" . static::$code . "): " . implode(PHP_EOL, static::$result));
        }

        return new static;
    }

    /**
     * @throws Exception
     */
    static function artisan(string $cmd): self
    {
        return static::exec(sprintf('php artisan %s', $cmd));
    }

    /**
     * @throws Exception
     */
    static function vite(string $cmd): self
    {
        return static::exec(sprintf('./vite.sh %s', $cmd));
    }

    /**
     * @throws Exception
     */
    static function npm(string $cmd): self
    {
        return static::exec(sprintf('npm %s', $cmd));
    }

    /**
     * @throws Exception
     */
    static function composer(string $cmd): self
    {
        return static::exec(sprintf('composer %s', $cmd));
    }

    /**
     * @throws Exception
     */
    static function copy(string $from, string $to): self
    {
        return static::exec(sprintf('cp %s %s', $from, $to));
    }

    /**
     * @throws Exception
     */
    static function copyRecursive(string $from, string $to): self
    {
        return static::exec(sprintf('cp -r %s %s', $from, $to));
    }

    /**
     * @throws Exception
     */
    static function remove(string $location, $recursive = true, $force = true): self
    {
        $options = [];
        if ($recursive) {
            $options[] = '-r';
        }
        if ($force) {
            $options[] = '-f';
        }

        if (realpath($location) === DIRECTORY_SEPARATOR || !realpath($location)) {
            throw new Exception('Will not remove root path');
        }

        return static::exec(sprintf('rm %s %s', implode(' ', $options), $location));
    }

    /**
     * @param string|null $set
     * @return string|static|null
     */
    static function inDir(string $set = null): self|null|string
    {
        static $folder;
        if ($set) {
            $folder = $set;
            return new static;
        }

        return $folder;
    }

    static function result(): array|null
    {
        return static::$result;
    }

    static function code(): int|null
    {
        return static::$code;
    }
}
