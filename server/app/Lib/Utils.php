<?php


namespace App\Lib;


use Exception;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Mail\Mailable;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Mail\SentMessage;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Log;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use ReflectionClass;
use ReflectionException;
use RegexIterator;


abstract class Utils
{


    /**
     * @throws Exception
     */
    static function compileBladeString(string $bladeString, array $data = []): string|false
    {
        $compiledString = Blade::compileString($bladeString);
        ob_start() and extract($data, EXTR_SKIP);
        try {
            eval('?>' . $compiledString);
        } catch (Exception $e) {
            ob_get_clean();
            throw $e;
        }
        return ob_get_clean();
    }

    /**
     * @throws ReflectionException
     */
    static function registerServiceProviderIn(
        string $path,
        Application|\Illuminate\Foundation\Application $app = null
    ): void {
        if (!$app) {
            $app = app();
        }
        foreach (self::discoverClassesIn($path, ServiceProvider::class) as $class) {
            $app->register($class);
        }
    }

    /**
     * @param string $path
     * @param string|array|Arrayable|Collection $class
     * @return array
     * @throws ReflectionException
     */
    static function discoverClassesIn(string $path, string|array|Arrayable|Collection $class): array
    {
        $discoverClasses = Collection::make($class);
        $fqcns = array();
        $allFiles = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path));
        $phpFiles = new RegexIterator($allFiles, '/\.php$/');
        foreach ($phpFiles as $phpFile) {
            $content = file_get_contents($phpFile->getRealPath());
            $tokens = token_get_all($content);
            $namespace = '';

            for ($index = 0; isset($tokens[$index]); $index++) {
                if (!isset($tokens[$index][0])) {
                    continue;
                }

                if (T_NAMESPACE === $tokens[$index][0]) {
                    $index += 2; // Skip namespace keyword and whitespace
                    while (isset($tokens[$index]) && is_array($tokens[$index])) {
                        $namespace .= $tokens[$index++][1];
                    }
                }

                if (T_CLASS === $tokens[$index][0] && T_WHITESPACE === $tokens[$index + 1][0] && T_STRING === $tokens[$index + 2][0]) {
                    $index += 2; // Skip class keyword and whitespace
                    $className = $namespace . '\\' . $tokens[$index][1];
                    $classReflection = new ReflectionClass($className);
                    foreach ($discoverClasses as $class) {
                        if ($classReflection->isSubclassOf($class)) {
                            $fqcns[] = $className;
                        }
                    }

                    break;
                }
            }
        }

        return $fqcns;
    }

    /**
     * @throws Exception
     */
    public static function mailTo(
        string|array|Arrayable $receivers,
        Mailable $mail,
        $silent = true
    ): SentMessage|false|null {
        // Always provide an array
        if (!is_array($receivers) && !is_object($receivers) && !($receivers instanceof Arrayable)) {
            $receivers = [$receivers];
        }

        // Explode multiple receivers per entry (separated by comma)
        $allReceiver = [];
        foreach ($receivers as $receiver) {
            if ($addReceiver = array_filter(array_map('trim', explode(',', $receiver)))) {
                $allReceiver = array_merge($allReceiver, $addReceiver);
            }
        }

        // Send mail
        try {
            return Mail::to($allReceiver)->send($mail);
        } catch (Exception $mailException) {
            if (!$silent) {
                throw $mailException;
            }

            Log::error('Mail exception: ' . $mailException->getMessage());
            if (app()->environment('local', 'dev')) {
                echo "Mail error: " . $mailException->getMessage() . PHP_EOL;
            }
            return false;
        }
    }
}
