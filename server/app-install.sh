#!/bin/bash

# Will install & setup current project.
# -> everything needed to run artisan & node

CURDIR=pwd=$(pwd)
echo "Install app in $CURDIR"

# Check if .env file existing
ENV_FILE=.env
CREATE=false
if [ -f $ENV_FILE ]; then
    if [ "$2" = "--skip" ]; then
        echo "Keep existing .env file"
    elif [ "$2" = "--force" ]; then
        echo "Overwriting existing .env file"
        rm $ENV_FILE
        CREATE=true
    else
        echo -e "\e[31mAbort install:\e[97m .env already exists.\e[0m To continue install use \e[35m--skip\e[0m to keep existing or \e[35m--force\e[0m to overwrite it:"
        echo "./app-install.sh staging --skip"
        echo "./app-install.sh staging --force"
        exit
    fi
else
    CREATE=true
fi

# Copy .env file
if [ "$CREATE" = true ]; then
    if [ -z $1 ]; then
        echo "Missing environment as 1st argument to create .env file:".
        echo "./app-install.sh local"
        echo "./app-install.sh staging"
        echo "./app-install.sh production"
    else
        APP_ENV=$1
    fi

    if [ "$APP_ENV" = "local" ]; then
        APP_ENV=development
    fi

    echo "Creating $ENV_FILE file from $ENV_FILE.$APP_ENV"
    cp $ENV_FILE.$APP_ENV $ENV_FILE
fi

# Read .env variables
source "$ENV_FILE"

# not required yet
#if [ -z "$APP_ENV" ]; then
#    echo "Abort install: required APP_ENV not set in .env $APP_ENV"
#    exit
#fi

# Install app
composer install
npm install

# Generate APP_KEY
if [ -z "$APP_KEY" ]; then
    echo "No app key set. Generate one..."
    php artisan key:generate
    source "$ENV_FILE"
    echo "App key generated: $APP_KEY"
fi

# Done
echo "App install finished. To configure app, run:"
echo "php artisan app:setup"
