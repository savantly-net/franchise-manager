#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd $DIR/..

ENV_FILE=.env

if [ -f "$ENV_FILE" ]; then
  source $ENV_FILE
fi

docker-compose -f module/docker-compose.yml up