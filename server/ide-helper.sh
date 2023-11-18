#!/bin/bash

php artisan ide-helper:generate
php artisan ide-helper:models --write-mixin -n
php artisan ide-helper:meta
