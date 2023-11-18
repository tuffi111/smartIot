<?php

namespace App\Lib\Command;

use Symfony\Component\Console\Output\OutputInterface;

trait output
{
    /* OutputInterface:
    const VERBOSITY_VERY_VERBOSE = 128;
    const VERBOSITY_QUIET = 16;
    const VERBOSITY_NORMAL = 32;
    const VERBOSITY_VERBOSE = 64;
    const VERBOSITY_VERY_VERBOSE = 128;
    const VERBOSITY_DEBUG = 256;
    /**/

    /** @var int */
    static private $withVerbosity;



    protected function writef(string $msg, ...$args): string
    {
        $msg = $this->sprintf($msg, ...$args);
        parent::getOutput()->write($msg);
        $this->resetVerbosity();
        return $msg;
    }

    protected  function linef($msg, ...$args): string
    {
        $msg = $this->sprintf($msg, ...$args);
        parent::line($msg, null, $this->withVerbosity());
        $this->resetVerbosity();
        return $msg;
    }

    protected function infof(string $msg, ...$args): string
    {
        $msg = $this->sprintf($msg, ...$args);
        parent::info($msg, $this->withVerbosity());
        $this->resetVerbosity();
        return $msg;
    }

    protected function warnf(string $msg, ...$args): string
    {
        $msg = $this->sprintf($msg, ...$args);
        parent::warn($msg, $this->withVerbosity());
        $this->resetVerbosity();
        return $msg;
    }

    protected function errorf(string $msg, ...$args): string
    {
        $msg = $this->sprintf($msg, ...$args);
        parent::error($msg, $this->withVerbosity());
        $this->resetVerbosity();
        return $msg;
    }

    protected function sprintf(string $msg, ...$args): string
    {
        if (count($args)) {
            $msg = sprintf($msg, ...$args);
        }

        if (!$this->canAnsi()) {
            $msg = preg_replace('/\e[[][A-Za-z0-9];?[0-9]*m?/', '', $msg); // strips ansi color codes
            //$test = preg_replace('#\\x1b[[][^A-Za-z]*[A-Za-z]#', '', $test); // strips all ansi codes (not tested).
        }

        return $msg;
    }

    protected function isInteractive(): bool
    {
        return !$this->option('no-interaction');
    }


    protected function isVerbose(): bool
    {
        return $this->option('verbose');
    }

    protected function canAnsi(): bool
    {
        return $this->option('no-ansi') !== true || $this->option('ansi') === true;
    }
    /**
     * @param int $set
     * @return int|self
     */
    protected function withVerbosity(int $set = null)
    {
        if (is_null($set)) {
            return static::$withVerbosity;
        }
        static::$withVerbosity = $set;
        return $this;
    }

    private function resetVerbosity()
    {
        static::$withVerbosity = OutputInterface::VERBOSITY_NORMAL;
    }
}
