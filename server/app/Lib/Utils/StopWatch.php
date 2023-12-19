<?php

namespace App\Lib\Utils;

class StopWatch
{
    private float $startedAt = 0;
    private float $stoppedAt = 0;
    private float $intermediate = 0;
    private bool $started = false;

    function now(): float
    {
        return microtime(true);
    }

    function start(): self
    {
        $this->startedAt = $this->intermediate = $this->now();
        $this->stoppedAt = 0;
        $this->started = true;
        return $this;
    }

    function stop(): self
    {
        $this->stoppedAt = $this->now();
        $this->started = false;
        return $this;
    }

    function intermediate(): float
    {
        if (!$this->isRunning()) {
            return 0;
        }

        $now = $this->now();
        $intermediate = $now - $this->intermediate;
        $this->intermediate = $now;
        return $intermediate;
    }

    function elapsed(): float
    {
        if ($this->stopped()) {
            return $this->stopped() - $this->started();
        }

        if (!$this->isRunning()) {
            return 0;
        }

        return $this->now() - $this->started();
    }

    function started(): float
    {
        return $this->startedAt;
    }

    function stopped(): float
    {
        return $this->stoppedAt;
    }

    function isRunning(): bool
    {
        return $this->started;
    }
}
