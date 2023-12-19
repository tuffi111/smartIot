<?php


namespace App\Lib\Utils\Zipper;

use Exception;
use Illuminate\Support\Collection;

class Zip extends ZipperAbstract
{
    /**
     * @throws Exception
     */
    function compress(): self
    {
        // basic shell command
        $cmd = 'zip -j';

        // add options to command
        if ($this->password()) {
            $cmd .= sprintf(' -P %s', $this->password());
        }

        // add target filename to command
        $cmd .= sprintf(' %s', $this->target());

        // add files to be compressed (respect max args of a cli and chunk files into different calls) to the command and execute
        $this->source()->chunk(10)->each(function (Collection $chunk) use ($cmd) {
            $out = [];
            $return = 0;
            $exec = sprintf($cmd . ' %s', $chunk->keys()->implode(' '));
            exec($exec, $out, $status);

            if ($status) {
                throw new Exception(implode(PHP_EOL, $out), $return);
            }
        });

        return $this;
    }
}
