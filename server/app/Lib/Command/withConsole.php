<?php

namespace App\Lib\Command;

use Illuminate\Console\Command;

trait withConsole
{
    private mixed $cliCommand = null;


    function console(Command $set = null): mixed
    {
        if ($set !== null) {
            $this->cliCommand = $set;
            return $this;
        }

        return $this->cliCommand;
    }
}
