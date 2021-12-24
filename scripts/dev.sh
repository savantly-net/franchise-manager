#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd $DIR/..

export REPO_ROOT=$(pwd)
docker-compose -f module/docker-compose.yml up