#!/bin/bash

php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan event:clear
php artisan optimize:clear

# Fix for Server raises 500 Internal Server error on mee-slim live, due to wrong permissions after cache was cleared ;(
chmod 777 bootstrap/cache
