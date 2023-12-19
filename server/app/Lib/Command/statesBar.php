<?php

namespace App\Lib\Command;

use Closure;
use Exception;
use Illuminate\Support\Collection;


/**
 * @method getOutput()
 */
trait statesBar
{
    use output;
    use states;
    use timer;

    private mixed $key;

    /**
     * @param array|Collection $collection collection to be processed (iterated over).
     * @param Closure $onItem called on each item of the collection (the current item key can be retrieved via ->key())
     * @param mixed|null $states class that make use of State trait. Holds the states while the loop is running.
     * @param string $label
     * @return Collection|array $collection Same collection passed to method.
     */
    function withStatesBar(
        array|Collection $collection,
        Closure $onItem,
        mixed $states = null,
        string $label = 'Items'
    ): Collection|array {
        if (!$states) {
            $states = $this;
        }

        if ($this->console()) {
            $bar = $this->console()->getOutput()->createProgressBar(count($collection));
        } else {
            $bar = $this->getOutput()->createProgressBar(count($collection));
        }

        $runtime = 0;
        $measurementInterval = 5;
        $lastMeasurement = 0;
        $itemsLeftLast = 0;
        $itemsPerSecond = 0;
        $itemsPerMinute = 0;
        $itemsPerHour = 0;
        $itemsEtaMinutes = 0;
        $itemsEtaHours = 0;
        $itemsLeft = 0;

        $bar->setRedrawFrequency(100);
        $bar->maxSecondsBetweenRedraws(3);
        $bar->minSecondsBetweenRedraws(2);
        $bar->setFormat("\n%message% %current%/%max% ║%bar%║ %percent:3s%%\n");
        $bar->setMessage(
            strtr($this->messageTemplate($states), [
                '%message' => '',
                '%errorList' => '',
                '%errors' => 0,
                '%skipped' => 0,
                '%created' => 0,
                '%updated' => 0,
                '%itemsPerSecond' => 0,
                '%measurementInterval' => 0,
                '%itemsPerMinute' => 0,
                '%itemsPerHour' => 0,
                '%etaMinutes' => 0,
                '%etaHours' => 0,
                '%itemsLeft' => number_format(0),
                '%runtime' => 0,
                '%label' => $label,
            ])
        );

        $bar->start();
        $this->timer()->start();

        foreach ($collection as $key => $value) {
            // calculate items processed per X seconds
            try {
                $this->setKey($key);
                $now = microtime(true);
                // Measurements
                if ($now >= ($lastMeasurement + $measurementInterval)) {
                    $lastMeasurement = $now;
                    $runtime = $this->timer()->elapsed();
                    $itemsLeft = $bar->getMaxSteps() - $bar->getProgress();
                    $itemsPerSecond = ($itemsLeftLast - $itemsLeft) / $measurementInterval;
                    $itemsPerMinute = $itemsPerSecond * 60;
                    $itemsPerHour = $itemsPerMinute * 60;
                    $itemsEtaMinutes = $itemsLeft / $itemsPerMinute;
                    $itemsEtaHours = (float)($itemsEtaHours + ($itemsLeft / $itemsPerHour)) / 2;
                    $itemsLeftLast = $itemsLeft;
                }

                $onItem($value, $states, $bar);

                $bar->setMessage(
                    strtr($this->messageTemplate($states), [
                        '%message' => $this->escapeAnsi($states->message()),
                        '%errorList' => $this->escapeAnsi($states->errors()->implode("\n\n")),
                        '%errors' => $states->errors()->count(),
                        '%skipped' => $states->skipped()->count(),
                        '%created' => $states->created()->count(),
                        '%updated' => $states->updated()->count(),
                        '%itemsLeft' => number_format($itemsLeft),
                        '%itemsPerSecond' => ($val = floor($itemsPerSecond)) > 0 ? $val : 0,
                        '%measurementInterval' => ($val = (float)$measurementInterval) > 0 ? $val : 0,
                        '%itemsPerMinute' => ($val = floor($itemsPerMinute)) > 0 ? $val : 0,
                        '%itemsPerHour' => ($val = floor($itemsPerHour / 1000)) > 0 ? $val : 0,
                        '%etaMinutes' => ($val = round($itemsEtaMinutes)) < 1 ? 'less than 1' : $val,
                        '%etaHours' => ($val = round($itemsEtaHours, 1)) < 1 ? 'less than 1' : $val,
                        '%runtime' => ($val = round($runtime / 60)) < 1 ? 'less than 1' : $val,
                        '%label' => $this->escapeAnsi($label),
                    ])
                );
            } catch (Exception $e) {
                $error = strtr($this->errorTemplate(), [
                    '%idx' => $states->errors()->count() + 1,
                    '%message' => $this->escapeAnsi($states->message()),
                    '%step' => $this->escapeAnsi($states->step()),
                    '%error' => $this->escapeAnsi($e->getMessage()),
                ]);

                $this->raiseError($error);
            }

            $bar->advance();
        }

        $this->timer()->stop();
        $bar->finish();

        return $collection;
    }

    /** Step to be displayed */
    function step(string $set = null): self|string
    {
        static $step = '';
        if ($set) {
            $step = $set;
            return $this;
        }
        return $step;
    }

    /** Message to be displayed */
    function message(string $set = null, ...$args): self|string
    {
        static $message = '';
        if ($set) {
            $message = $this->sprintf($set, ...$args);
            return $this;
        }
        return $message;
    }

    function messageTemplate($states): string
    {
        return $this->escapeAnsi(
            (($states->errors()->count()) ?
                "\n"
                . "\e[31mLast errors: \e[0m\n"
                . "%errorList \e[0m\n\n"
                :
                ""
            )
            . "\e[31mErrors: \e[91m%errors \e[90m│\e[0m "
            . "\e[33mSkipped: \e[93m%skipped \e[90m│\e[0m "
            . "\e[32mCreated: \e[92m%created \e[90m│\e[0m "
            . "\e[36mUpdated: \e[96m%updated \e[90m│\e[0m "
            . "\e[34mSpeed: \e[94m%itemsPerSecond\e[34m/s ¦ \e[94m%itemsPerMinute\e[34m/m ¦ \e[94m%itemsPerHour\e[34mk/h \e[90m│\e[0m "
            . "\e[35mTime due: \e[35m%runtime\e[35mm \e[90m│\e[0m "
            . "\e[95mEta: \e[95m%etaMinutes\e[95mm ¦ \e[95m%etaHours\e[95mh\e[0m\n"
            . "%message\n"
            . "%label left: \e[97m%itemsLeft \e[90m¦\e[0m processed:"
        );
    }

    function errorTemplate(): string
    {
        return $this->escapeAnsi(
            "\e[31mError \e[91m#%idx\e[0m on '\e[97m%message\e[0m' in step '\e[97m%step\e[0m':\n%error"
        );
    }

    /**
     * Set the key of the current collection item being processed
     */
    private function setKey(mixed $set): self
    {
        $this->key = $set;
        return $this;
    }

    /**
     * Return the index key of the current processed collection item
     */
    function key(): mixed
    {
        return $this->key;
    }
}
