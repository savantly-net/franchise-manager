#!/bin/bash


DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd $DIR/..

heroku container:login

heroku container:push web -a api-franchise-manager
heroku container:release web -a api-franchise-manager


docker tag savantly/sprout-webapp:latest registry.heroku.com/franchise-manager/web
docker push registry.heroku.com/franchise-manager/web
heroku container:release web -a franchise-manager