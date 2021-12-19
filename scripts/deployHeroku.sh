#!/bin/bash


DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd $DIR/..

IMAGE_NAME=franchise-manager-demo

docker build -t savantly/${IMAGE_NAME} .

heroku container:login

docker tag savantly/${IMAGE_NAME}:latest registry.heroku.com/franchise-manager/web
docker push registry.heroku.com/franchise-manager/web

heroku container:release web -a franchise-manager
