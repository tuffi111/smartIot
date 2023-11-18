#!/bin/bash

# proxy for laravel/sail
# exposes "APP_SERVICE" for laravel/sail to provide a custom service name (default: "laravel.test") defined in docker-compose (default: services:laravel.test:*)

export APP_SERVICE=http
./vendor/bin/sail "$@"
