<?php

namespace App\Lib\Command;

use Illuminate\Support\Collection;


trait states
{
    use output;

    /** @var Collection */
    private $infos;
    /** @var Collection */
    private $warnings;
    /** @var Collection */
    private $errors;
    /** @var Collection */
    private $created;
    /** @var Collection */
    private $skipped;
    /** @var Collection */
    private $updated;
    /** @var float */
    private $startedAt = 0;
    /** @var float */
    private $stoppedAt = 0;


    protected function created(): Collection
    {
        if (!$this->created) {
            $this->created = new Collection();
        }
        return $this->created;
    }

    protected function updated(): Collection
    {
        if (!$this->updated) {
            $this->updated = new Collection();
        }
        return $this->updated;
    }

    protected function skipped(): Collection
    {
        if (!$this->skipped) {
            $this->skipped = new Collection();
        }
        return $this->skipped;
    }

    protected function infos(): Collection
    {
        if (!$this->infos) {
            $this->infos = new Collection();
        }
        return $this->infos;
    }

    protected function warnings(): Collection
    {
        if (!$this->warnings) {
            $this->warnings = new Collection();
        }
        return $this->warnings;
    }

    protected function errors(): Collection
    {
        if (!$this->errors) {
            $this->errors = new Collection();
        }
        return $this->errors;
    }

    protected function raiseWarning(string $msg, ...$args)
    {
        if (count($args)) {
            $msg = $this->sprintf($msg, ...$args);
        }
        $this->warnf($msg);
        $this->warnings()->push($msg);
    }

    protected function raiseError(string $msg, ...$args)
    {
        if (count($args)) {
            $msg = $this->sprintf($msg, ...$args);
        }
        $this->errorf($msg);
        $this->errors()->push($msg);
    }

    protected function raiseInfo(string $msg, ...$args)
    {
        if (count($args)) {
            $msg = $this->sprintf($msg, ...$args);
        }
        $this->infof($msg);
        $this->infos()->push($msg);
    }

    protected function messageTemplate(): string
    {
        if ($this->option('no-ansi')) {
            return "\n"
                . "Last errors:\n"
                . "%errorList\n\n"
                . "Errors : %errors | "
                . "Skipped: %skipped | "
                . "Created: %created | "
                . "Updated: %updated | "
                . "Speed: %itemsPerSecond/s ¦ %itemsPerMinute/m ¦ %itemsPerHourk/h | "
                . "Time due: %runtimem | "
                . "Eta: %etaMinutesm ¦ %etaHoursh\n"
                . "%message\n"
                . "%label left: %itemsLeft ¦ processed:";
        } else {
            return "\n"
                . "\e[31mLast errors: \e[0m\n"
                . "%errorList \e[0m\n\n"
                . "\e[31mErrors: \e[91m%errors \e[90m│\e[0m "
                . "\e[33mSkipped: \e[93m%skipped \e[90m│\e[0m "
                . "\e[32mCreated: \e[92m%created \e[90m│\e[0m "
                . "\e[36mUpdated: \e[96m%updated \e[90m│\e[0m "
                . "\e[34mSpeed: \e[94m%itemsPerSecond\e[34m/s ¦ \e[94m%itemsPerMinute\e[34m/m ¦ \e[94m%itemsPerHour\e[34mk/h \e[90m│\e[0m "
                . "\e[35mTime due: \e[35m%runtime\e[35mm \e[90m│\e[0m "
                . "\e[95mEta: \e[95m%etaMinutes\e[95mm ¦ \e[95m%etaHours\e[95mh\e[0m\n"
                . "%message\n"
                . "%label left: \e[97m%itemsLeft \e[90m¦\e[0m processed:";
        }
    }

    protected function errorTemplate(): string
    {
        if ($this->option('no-ansi')) {
            return "Error #%idx on '%message' in step '%step':\n%error";
        } else {
            return "\e[31mError \e[91m#%idx\e[0m on '\e[97m%message\e[0m' in step '\e[97m%step\e[0m':\n%error";
        }
    }
}
