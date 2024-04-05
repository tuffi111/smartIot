<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class authClientMake extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'auth:client:make';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->create('personal', 'PERSONAL_ACCESS_TOKEN', 1, 'users');
        $this->create('password', 'PASSWORD_GRANT_TOKEN', 1, 'users');
    }



    public function create($type, $name, $userId, $provider)
    {
        $out = [];
        $resultCode = 0;
        exec(
            sprintf(
                'php artisan passport:client --%s --no-interaction --no-ansi --provider=%s --name=%s --user_id=%d',
                $type,
                $provider,
                $name,
                $userId
            ),
            $out,
            $resultCode
        );

        if ($resultCode !== 0) {
            dump($resultCode, $out);
            throw new \Exception('Error executing command');
        }

        $clientId = null;
        $clientSecret = null;
        foreach ($out as $line) {
            $line = trim($line);

            if (Str::startsWith(strtolower($line), 'client id')) {
                $clientId = Str::afterLast($line, ' ');
            }

            if (Str::startsWith(strtolower($line), 'client secret')) {
                $clientSecret = Str::afterLast($line, ' ');
            }

            if ($clientSecret && $clientId) {
                break;
            }
        }

        if (!$clientId || !$clientSecret) {
            throw new \Exception('ID not found');
        }


        $data = [
            'Name' => $name,
            'User ID' => $userId,
            'Provider' => $provider,
            'Client ID' => $clientId,
            'Client Secret' => $clientSecret,
        ];


        $store = json_decode(Storage::get('auth-tokens-'.$type.'.json') ?? "[]", true);

        if (!is_array($store)) {
            $store = [];
        }

        $store[] = $data;
        Storage::put('auth-tokens-'.$type.'.json', json_encode($store));

        $this->info($type.' tokens  created!');
        dump($data);
    }
}
