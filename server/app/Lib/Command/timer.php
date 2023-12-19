<?php

namespace App\Lib\Command;


use App\Lib\Utils\StopWatch;

trait timer
{
    private ?StopWatch $timer = null;

    function timer(): StopWatch
    {
        if (!$this->timer) {
            $this->timer = new StopWatch();
        }
        return $this->timer;
    }
}
