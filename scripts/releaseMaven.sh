#!/bin/bash


DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd $DIR/..

./gradlew clean && ./gradlew publishMavenJavaPublicationToMavenLocal && ./gradlew publishMavenJavaPublicationToOSSRHRepository