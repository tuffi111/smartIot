<?php

namespace App\Lib\Command;

trait timer
{
    /** @var float */
    private int|float $startedAt = 0;
    /** @var float */
    private int|float $stoppedAt = 0;

    protected function start(): self
    {
        $this->startedAt = $this->now();
        return $this;
    }


    protected function stop(): self
    {
        $this->stoppedAt = $this->now();
        return $this;
    }

    protected function duration(): float
    {
        if ($this->stoppedAt) {
            return 0;
        }

        return $this->stoppedAt - $this->startedAt;
    }

    protected function intermediate(): float
    {
        if (!$this->startedAt) {
            return 0;
        }

        return $this->now() - $this->startedAt;
    }

    protected function started(): float
    {
        return $this->startedAt;
    }

    protected function stopped(): float
    {
        return $this->stoppedAt;
    }

    protected function now(): float
    {
        return microtime(true);
    }
}
