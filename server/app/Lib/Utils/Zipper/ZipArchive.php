<?php


namespace App\Lib\Utils\Zipper;


use Exception;

class ZipArchive extends ZipperAbstract
{
    /**
     * @throws Exception
     */
    function compress(): self
    {
        $zip = new \ZipArchive();

        if (!$zip->open($this->target(), \ZipArchive::CREATE) === true) {
            throw new Exception(sprintf('Could not create file "%s"', $this->target()));
        }

        $this->source()->each(function ($filename, $file) use ($zip) {
            $filename = basename($file);
            $zip->addFile($file, $filename);
            if ($pass = $this->password()) {
                if (!$zip->setEncryptionName($filename, \ZipArchive::EM_AES_256, $pass)) {
                    throw new Exception(sprintf('Could not protect file "%s"', $filename));
                }
            }
        });

        $zip->close();
        return $this;
    }
}
