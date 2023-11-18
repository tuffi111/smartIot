<?php

namespace App\Lib\Command;

use Exception;
use Illuminate\Console\Command as BaseCommand;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

abstract class Command extends BaseCommand
{
    use options;
    use output;

    const MethodPostfix = 'Handler';

    function menu(string $question, array|Collection $actions, string $handleAction = null): string|null
    {
        static $stop = null;
        $actions = new Collection($actions);
        $choices = $actions->map(function ($choice) {
            return is_array($choice) ? $choice['label'] : $choice;
        });
        $shouldStop = null;

        do { // Display $actions and call camelcased method(action.key) on this class
            $actionKey = $handleAction ?? $this->choice($question, $choices->toArray());
            $action = Collection::make(['label' => '', 'handle' => null])->merge($actions->get($actionKey));
            $handler = $action['handle'];

            if ($actionKey === 'exit') {
                return 'exit';
            } elseif ($actionKey === 'back') {
                if (!$handler) {
                    $handler = [$this, 'handle'];
                }
                $stop = 'Back';
            } else {
                $prefix = ''; //todo: nested calls
                $method = Str::camel($prefix . $actionKey) . static::MethodPostfix;
                $stop = null;
            }

            try {
                // Hint: is_callable considers not existing methods on $this as callable! Though this check won't work for $this and fails with an exception.
                if (!is_callable($handler, true)) {
                    $handler = [$this, $method];
                }

                if (is_callable($handler, true)) {
                    $shouldStop = call_user_func_array($handler, []);
                }
            } catch (Exception $e) {
                $this->error($e->getMessage());
            }

            $actionKey = null;
            if ($this->isInteractive()) {
                $stop = 'no-interaction set. Command ends after executing action.';
            }
            if ($handleAction) {
                $stop = 'Action was called directly from cli. Command ends after executing action.';
            }
        } while (!$stop && !$shouldStop);

        return $shouldStop ?? $stop;
    }
}
