<?php

namespace App\Lib\Command;

use Illuminate\Support\Collection;


trait states
{
    use output;

    private ?Collection $infos = null;
    private ?Collection $warnings = null;
    private ?Collection $errors = null;
    private ?Collection $created = null;
    private ?Collection $skipped = null;
    private ?Collection $updated = null;
    private float $startedAt = 0;
    private float $stoppedAt = 0;


    function created(): Collection
    {
        if (!$this->created) {
            $this->created = new Collection();
        }
        return $this->created;
    }

    function updated(): Collection
    {
        if (!$this->updated) {
            $this->updated = new Collection();
        }
        return $this->updated;
    }

    function skipped(): Collection
    {
        if (!$this->skipped) {
            $this->skipped = new Collection();
        }
        return $this->skipped;
    }

    function infos(): Collection
    {
        if (!$this->infos) {
            $this->infos = new Collection();
        }
        return $this->infos;
    }

    function warnings(): Collection
    {
        if (!$this->warnings) {
            $this->warnings = new Collection();
        }
        return $this->warnings;
    }

    function errors(): Collection
    {
        if (!$this->errors) {
            $this->errors = new Collection();
        }
        return $this->errors;
    }

    function raiseSkipped(string $msg, ...$args): self
    {
        $this->skipped()->push($this->infoLog($msg, ...$args));
        return $this;
    }

    function raiseWarning(string $msg, ...$args): self
    {
        $this->warnings()->push($this->warnLog($msg, ...$args));
        return $this;
    }

    function raiseError(string $msg, ...$args): self
    {
        $this->errors()->push($this->errorLog($msg, ...$args));
        return $this;
    }

    function raiseInfo(string $msg, ...$args): self
    {
        $this->infos()->push($this->infoLog($msg, ...$args));
        return $this;
    }
}
