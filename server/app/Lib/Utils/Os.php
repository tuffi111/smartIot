<?php

namespace App\Lib\Utils;

use Exception;

class Os
{
    const OS_NIX = 'nix';
    const OS_MAC = 'mac';
    const OS_WIN = 'win';
    static private string $osName;

    /**
     * @throws Exception
     */
    static function name(?string $set = null): string
    {
        if (!static::$osName || !is_null($set)) {
            static::$osName = $set ?? static::detect();
        }
        return static::$osName;
    }

    /**
     * @throws Exception
     */
    static function is(string $os): bool
    {
        return static::name() === $os;
    }

    /**
     * @throws Exception
     */
    static function detect(): string
    {
        return match (strtoupper(substr(PHP_OS, 0, 3))) {
            'LIN', 'UNI' => self::OS_NIX,
            'DAR' => self::OS_MAC,
            'WIN' => self::OS_WIN,
            default => throw new Exception(sprintf('Unsupported OS: "%s', PHP_OS)),
        };
    }

    /**
     * @throws Exception
     */
    static function makeCmdFromFuncArgs(array|string $cmd, array $args): string
    {
        array_shift($args);
        return static::makeCmd($cmd, $args);
    }

    /**
     * @throws Exception
     */
    static function makeCmd(array|string $cmd, array $args): string
    {
        if (!is_array($cmd)) {
            $cmd = [
                self::OS_NIX => $cmd,
                self::OS_MAC => $cmd,
                self::OS_WIN => $cmd
            ];
        }

        return vsprintf($cmd[static::name()], $args);
    }
}
