export PROJECT_ROOT := $(shell pwd)

.PHONY: yarn
yarn:
	docker run --volume ${PROJECT_ROOT}:/app --workdir /app node:14 yarn

.PHONY: dev
dev: yarn
	docker compose up

.PHONY: build
build:
	./gradlew build