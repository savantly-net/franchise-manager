export PROJECT_ROOT := $(shell pwd)

.PHONY: yarn
yarn:
	docker run --volume ${PROJECT_ROOT}:/app --workdir /app node:14 yarn

.PHONY: dev
dev:
	gradle bootRun -x nodeSetup -x yarnSetup -x yarn -x yarn_build
#docker compose up --remove-orphans

.PHONY: build
build:
	./gradlew build

# requires gpg installed 
# brew install gpg
.PHONY: publish-local
publish-local:
	export KEYNAME=`gpg --list-secret-keys --keyid-format LONG | grep "sec" | awk -F'[/ ]' '{print $5}' | head -n 1`
	./gradlew :fm-module:publishMavenJavaPublicationToMavenLocal \
    -PversionPostfix=SNAPSHOT \
    -Psigning.gnupg.keyName=$$KEYNAME