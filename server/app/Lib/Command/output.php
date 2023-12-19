<?php

namespace App\Lib\Command;

use Illuminate\Support\Facades\Log;
use Symfony\Component\Console\Helper\TableCell;
use Symfony\Component\Console\Output\OutputInterface;

trait output
{
    use withConsole;

    /* OutputInterface:
        const VERBOSITY_VERY_VERBOSE = 128;
        const VERBOSITY_QUIET = 16;
        const VERBOSITY_NORMAL = 32;
        const VERBOSITY_VERBOSE = 64;
        const VERBOSITY_VERY_VERBOSE = 128;
        const VERBOSITY_DEBUG = 256;
    /**/

    private ?int $withVerbosity = null;
    private ?array $withContext = [];
    private bool|string|null $withDefault = null;
    private ?bool $withFallback = null;
    private string|null $withStyle = null;
    private mixed $cliCommand = null;


    /**
     * @param string $string
     * @param string|null $style
     * @param int|string|null $verbosity
     * @return void
     */
    function line($string, $style = null, $verbosity = null): void
    {
        if ($this->console()) {
            $this->console()->line($this->escapeAnsi($string), $style, $verbosity);
        } else {
            parent::line($this->escapeAnsi($string), $style, $verbosity);
        }
    }

     function linef(string $msg, ...$args): string
    {
        $msg = $this->sprintf($msg, ...$args);
        $this->line($msg, $this->withStyle(), $this->withVerbosity());
        $this->resetStyle();
        $this->resetVerbosity();
        return $msg;
    }

     function lineLog(string $message = '', ...$args): self
    {
        Log::debug($this->linef($message, ...$args), $this->withContext());
        $this->resetContext();
        return $this;
    }

    function write(string $msg): string
    {
        $msg = $this->escapeAnsi($msg);
        if ($this->console()) {
            $this->console()->getOutput()->write($msg);
        } else {
            parent::getOutput()->write($msg);
        }

        return $msg;
    }

     function writef(string $msg, ...$args): string
    {
        $msg = $this->sprintf($msg, ...$args);
        $this->write($msg);
        return $msg;
    }

    function writeLog(string $msg, ...$args): self
    {
        Log::log($this->writef($msg, ...$args), $this->withContext());
        $this->resetContext();
        return $this;
    }


    /**
     * @param string $string
     * @param int|string|null $verbosity
     * @return void
     */
    function info($string, $verbosity = null): void
    {
        if ($this->console()) {
            $this->console()->info($this->escapeAnsi($string), $verbosity);
        } else {
            parent::info($this->escapeAnsi($string), $verbosity);
        }
    }

    function infof(string $msg, ...$args): string
    {
        $msg = $this->sprintf($msg, ...$args);
        $this->info($msg, $this->withVerbosity());
        $this->resetVerbosity();
        return $msg;
    }

    function infoLog(string $message, ...$args): self
    {
        Log::info($this->infof($message, ...$args), $this->withContext());
        $this->resetContext();
        return $this;
    }


    /**
     * @param string $string
     * @param int|string|null $verbosity
     * @return void
     */
    function warn($string, $verbosity = null): void
    {
        if ($this->console()) {
            $this->console()->warn($this->escapeAnsi($string), $verbosity);
        } else {
            parent::warn($this->escapeAnsi($string), $verbosity);
        }
    }

    function warnf(string $msg, ...$args): string
    {
        $msg = $this->sprintf($msg, ...$args);
        $this->warn($msg, $this->withVerbosity());
        $this->resetVerbosity();
        return $msg;
    }

    function warningLog(...$args): self
    {
        return $this->warnLog(...$args);
    }

    function warnLog(string $message, ...$args): self
    {
        Log::warning($this->warnf($message, ...$args), $this->withContext());
        $this->resetContext();
        return $this;
    }

    /**
     * @param string $string
     * @param int|string|null $verbosity
     * @return void
     */
    function error($string, $verbosity = null): void
    {
        if ($this->console()) {
            $this->console()->error($this->escapeAnsi($string), $verbosity);
        } else {
            parent::error($this->escapeAnsi($string), $verbosity);
        }
    }

    function errorf(string $msg, ...$args): string
    {
        $msg = $this->sprintf($msg, ...$args);
        $this->error($msg, $this->withVerbosity());
        $this->resetVerbosity();
        return $msg;
    }

    function errorLog(string $message, ...$args): self
    {
        Log::error($this->errorf($message, ...$args), $this->withContext());
        $this->resetContext();
        return $this;
    }

    /**
     * @param string $string
     * @param int|string|null $verbosity
     * @return void
     */
    function alert($string, $verbosity = null): void
    {
        if ($this->console()) {
            $this->console()->alert($this->escapeAnsi($string), $verbosity);
        } else {
            parent::alert($this->escapeAnsi($string), $verbosity);
        }
    }

    function alertf(string $msg, ...$args): string
    {
        $msg = $this->sprintf($msg, ...$args);
        $this->alert($msg, $this->withVerbosity());
        $this->resetVerbosity();
        return $msg;
    }

    function alertLog(string $message, ...$args): self
    {
        Log::alert($this->alertf($message, ...$args), $this->withContext());
        $this->resetContext();
        return $this;
    }

    function critical(string $message): void
    {
        $this->alert($message);
    }

    function criticalf(...$args): string
    {
        return $this->alertf(...$args);
    }

    function criticalLog(string $message, ...$args): self
    {
        Log::critical($this->criticalf($message, ...$args), $this->withContext());
        $this->resetContext();
        return $this;
    }


    function emergency(string $message): void
    {
        $this->alert($message);
    }

    function emergencyf(...$args): string
    {
        return $this->alertf(...$args);
    }

    function emergencyLog(string $message, ...$args): self
    {
        Log::emergency($this->emergencyf($message, ...$args), $this->withContext());
        $this->resetContext();
        return $this;
    }

    /**
     * @param string $string
     * @param int|string|null $verbosity
     * @return void
     */
    function comment($string, $verbosity = null): void
    {
        if ($this->console()) {
            $this->console()->comment($this->escapeAnsi($string), $verbosity);
        } else {
            parent::comment($this->escapeAnsi($string), $verbosity);
        }
    }


    function commentf(string $msg, ...$args): string
    {
        $msg = $this->sprintf($msg, ...$args);
        $this->comment($msg, $this->withVerbosity());
        $this->resetVerbosity();
        return $msg;
    }

    function commentLog(string $message, ...$args): self
    {
        Log::notice($this->commentf($message, ...$args), $this->withContext());
        $this->resetContext();
        return $this;
    }


    function success(string $message, ...$args): string
    {
        $msg = $this->sprintf("Success: " . $message, ...$args);
        $this->line($msg);
        return $msg;
    }

    function successLog(string $message, ...$args): self
    {
        Log::notice($this->success($message, ...$args), $this->withContext());
        $this->resetContext();
        return $this;
    }

    function fail(string $message, ...$args): string
    {
        $msg = $this->sprintf("Failed: " . $message, ...$args);
        $this->line($msg);
        return $msg;
    }

    function failLog(string $message, ...$args): self
    {
        Log::warning($this->fail($message, ...$args), $this->withContext());
        $this->resetContext();
        return $this;
    }

    function section(string $msg): string
    {
        $msg = $this->escapeAnsi($msg);
        if ($this->console()) {
            $this->console()->getOutput()->section($msg);
        } else {
            parent::getOutput()->section($msg);
        }
        return $msg;
    }

    function sectionf(string $msg, ...$args): string
    {
        return $this->section($this->sprintf($msg, ...$args));
    }

    function title(string $msg): string
    {
        $msg = $this->escapeAnsi($msg);
        if ($this->console()) {
            $this->console()->getOutput()->title($msg);
        } else {
            parent::getOutput()->title($msg);
        }
        return $msg;
    }

    function titlef(string $msg, ...$args): string
    {
        return $this->title($this->sprintf($msg, ...$args));
    }

    function text(string $msg): string
    {
        $msg = $this->escapeAnsi($msg);
        if ($this->console()) {
            $this->console()->getOutput()->text($msg);
        } else {
            parent::getOutput()->text($msg);
        }
        return $msg;
    }

    function textf(string $msg, ...$args): string
    {
        return $this->text($this->sprintf($msg, ...$args));
    }

    /**
     * @param string $string
     * @param int|string|null $verbosity
     * @return void
     */
    function question($string, $verbosity = null): void
    {
        if ($this->console()) {
            $this->console()->question($this->escapeAnsi($string), $verbosity);
        } else {
            parent::question($this->escapeAnsi($string), $verbosity);
        }
    }


    function questionf(string $msg, ...$args): string
    {
        $msg = $this->sprintf($msg, ...$args);
        $this->question($msg, $this->withVerbosity());
        $this->resetVerbosity();
        return $msg;
    }

    /**
     * @param string $question
     * @param bool $fallback
     * @return mixed
     */
    function secret($question, $fallback = true): mixed
    {
        if ($this->console()) {
            return $this->console()->secret($this->escapeAnsi($question), $fallback);
        }
        return parent::secret($this->escapeAnsi($question), $fallback);
    }

    function secretf(string $question, ...$args): mixed
    {
        $result = $this->secret($this->sprintf($question, ...$args), $this->withFallback());
        $this->resetFallback();
        return $result;
    }

    /**
     * @param string $question
     * @param bool $default
     * @return bool
     */
    function confirm($question, $default = false): bool
    {
        if ($this->console()) {
            return $this->console()->confirm($this->escapeAnsi($question), $default);
        }
        return parent::confirm($this->escapeAnsi($question), $default);
    }

    function confirmf(string $question, ...$args): bool
    {
        $result = $this->confirm($this->sprintf($question, ...$args), $this->withDefault());
        $this->resetDefault();
        return $result;
    }

    /**
     * @param string $question
     * @param string|null $default
     * @return mixed
     */
    public function ask($question, $default = null): mixed
    {
        if ($this->console()) {
            return $this->console()->ask($this->escapeAnsi($question), $default);
        }

        return parent::ask($this->escapeAnsi($question), $default);
    }

    function askf(string $question, ...$args): string
    {
        $result = $this->ask($this->sprintf($question, ...$args), $this->withDefault());
        $this->resetDefault();
        return $result;
    }

    function table(...$args): void
    {
        if ($this->console()) {
            $this->console()->table(...$args);
        } else {
            parent::table(...$args);
        }
    }

    function listing(array $elements): array
    {
        if ($this->console()) {
            $this->console()->getOutput()->listing($elements);
        } else {
            parent::getOutput()->listing($elements);
        }
        return $elements;
    }

    function params(string $title, array $list): self
    {
        $rows = [];
        foreach ($list as $k => $v) {
            $rows[] = [$this->escapeAnsi("\e[1;37m$k\e[0m"), $this->escapeAnsi("\e[1;97m$v\e[0m")];
        }

        $header = [];
        if ($title) {
            $header = [new TableCell($title, ['colspan' => 2])];
        }

        $this->table($header, $rows);
        return $this;
    }

    function dataList(array $data, string $pad = ' '): self
    {
        $longestKeyLength = max(array_map('strlen', array_flip($data)));
        foreach ($data as $k => $v) {
            $this->line(
                sprintf(
                    '%s: %s'
                    ,
                    str_pad($k, $longestKeyLength, $pad)
                    ,
                    $v
                )
            );
        }

        return $this;
    }

    function sprintf(string $msg, ...$args): string
    {
        if (count($args)) {
            $msg = sprintf($msg, ...$args);
        }
        return $msg;
    }

    function escapeAnsi(string $msg): string
    {
        if (!$this->canAnsi()) {
            $msg = preg_replace('/\e[[][A-Za-z0-9];?[0-9]*m?/', '', $msg); // strips ansi color codes
            //$test = preg_replace('#\\x1b[[][^A-Za-z]*[A-Za-z]#', '', $test); // strips all ansi codes (not tested).
        }
        return $msg;
    }

    function isInteractive(): bool
    {
        return !$this->option('no-interaction');
    }


    function isVerbose(): bool
    {
        return $this->option('verbose');
    }

    function canAnsi(): bool
    {
        return $this->option('no-ansi') !== true || $this->option('ansi') === true;
    }

    function option(...$args): array|bool|null|string
    {
        if ($this->console()) {
            return $this->console()->option(...$args);
        }
        return parent::option(...$args);
    }

    function withVerbosity(int $set = null): int|self|null
    {
        if (is_null($set)) {
            return $this->withVerbosity;
        }
        $this->withVerbosity = $set;
        return $this;
    }

    private function resetVerbosity(): self
    {
        $this->withVerbosity = OutputInterface::VERBOSITY_NORMAL;
        return $this;
    }

    function withContext(array $set = null): array|self|null
    {
        if (is_null($set)) {
            return $this->withContext;
        }
        $this->withContext = $set;
        return $this;
    }

    private function resetContext(): self
    {
        $this->withContext = [];
        return $this;
    }


    function withStyle(string $set = null): string|self|null
    {
        if (is_null($set)) {
            return $this->withStyle;
        }
        $this->withStyle = $set;
        return $this;
    }

    private function resetStyle(): self
    {
        $this->withStyle = null;
        return $this;
    }


    function withDefault(bool|string $set = null): bool|string|self|null
    {
        if (is_null($set)) {
            return $this->withDefault;
        }
        $this->withDefault = $set;
        return $this;
    }

    private function resetDefault(): self
    {
        $this->withDefault = null;
        return $this;
    }

    function withFallback(bool $set = null): bool|self
    {
        if (is_null($set)) {
            return $this->withFallback;
        }
        $this->withFallback = $set;
        return $this;
    }

    private function resetFallback(): self
    {
        $this->withFallback = false;
        return $this;
    }
}
