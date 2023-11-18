<?php

namespace App\Ziggy;

use Stringable;
use Tightenco\Ziggy\Ziggy;

class AppRoute implements Stringable
{
    protected string $function;

    public function __construct(protected Ziggy $ziggy, string $function, protected string $nonce = '')
    {
        $function = file_get_contents(base_path('vendor/tightenco/ziggy/dist/index.js'));
        $this->function = str_replace('.route=', '.appRoute=', $function);
    }

    public function __toString(): string
    {
        return <<<HTML
<script type="text/javascript"{$this->nonce}>
    const Ziggy = {$this->ziggy->toJson()};
    {$this->function}
</script>
HTML;
    }
}
