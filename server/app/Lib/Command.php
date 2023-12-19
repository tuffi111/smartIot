<?php

namespace App\Lib;

use App\Lib\Command\options;
use App\Lib\Command\output;
use Illuminate\Console\Command as BaseCommand;

abstract class Command extends BaseCommand
{
    use options;
    use output;
}
