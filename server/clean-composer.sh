#!/bin/bash

rm -rf ./vendor
composer clear-cache
composer install
