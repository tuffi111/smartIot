#!/bin/bash

./clean-caches.sh
./app-install.sh "" --skip
php artisan migrate
php artisan assets:refresh
npm run dev
