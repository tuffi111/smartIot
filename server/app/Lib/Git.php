<?php

namespace App\Lib;

use Exception;
use Illuminate\Support\Collection;

class Git
{

    /**
     * @throws Exception
     */
    static function exec(string $cmd, ...$args): array
    {
        $result = null;
        $code = null;

        if (count($args)) {
            $cmd = sprintf($cmd, ...$args);
        }

        $params = [];
        if ($sshKeyFile = static::sshKey() ?? config('mee.slim.deploy.sshKey')) {
            $params[] = sprintf('-c core.sshCommand="%s -i %s"', config('mee.slim.deploy.sshCommand'), $sshKeyFile);
        }

        $options = '';
        static::option()->each(function ($value, $key) use (&$options) {
            $options .= sprintf("%s %s ", $key, $value);
        });

        $cmd = trim(
            sprintf(
                "%s git %s %s %s",
                (($repos = static::repos()) ? "cd $repos &&" : ''),
                trim(implode(' ', $params)),
                $cmd,
                trim($options),
            )
        );

        exec($cmd, $result, $code);

        if (!is_array($result)) {
            $result = [$result];
        }

        if ($code) {
            throw new Exception("Error executing git '$cmd' (" . $code . "): " . implode(PHP_EOL, $result));
        }

        return $result;
    }

    /**
     * @throws Exception
     */
    static function tags(): Collection
    {
        return new Collection(static::exec('tag -l'));
    }

    /**
     * @throws Exception
     */
    static function clone(string $repos, string $intoPath): array
    {
        return static::exec(
            sprintf('clone %s %s', $repos, $intoPath)
        );
    }


    /**
     * @throws Exception
     */
    static function pull(string $remote = '', string $branch = ''): array
    {
        return static::exec(trim(sprintf('pull %s %s', $remote, $branch)));
    }

    /**
     * @throws Exception
     */
    static function fetch(): array
    {
        return static::exec('fetch --all --tags');
    }

    /**
     * @throws Exception
     */
    static function config(string $key, ...$args): string
    {
        if (!count($args)) {
            $set = new IsNull();
        } else {
            $set = array_shift($args);
        }

        if ($set instanceof IsNull) {
            try {
                return current(static::exec('config %s ', $key));
            } catch (Exception $e) {
                return '';
            }
        }

        return current(static::exec('config %s %s', $key, $set));
    }


    static function repos(string $set = null): self|null|string
    {
        static $repos;
        if ($set) {
            $repos = $set;
            return new static;
        }

        return $repos;
    }

    static function sshKey(string $set = null): self|null|string
    {
        static $sshKey;
        if ($set) {
            $sshKey = $set;
            return new static;
        }

        return $sshKey;
    }

    /**
     * @throws Exception
     */
    static function test(): array
    {
        return static::exec('fetch');
    }

    static function option(string $key = null, string $set = null): self|Collection
    {
        static $options = new Collection();
        if (is_null($key)) {
            return $options;
        }

        $options->put($key, $set);
        return new static;
    }
}
