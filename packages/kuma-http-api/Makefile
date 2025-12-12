# Please keep this file free of actual scripts
# It should only be used for adding "non-dot" aliases and documentation

SHELL := /usr/bin/env bash

NPM_WORKSPACE_ROOT := $(shell npm prefix)
KUMAHQ_CONFIG := $(NPM_WORKSPACE_ROOT)/$(shell cat $(NPM_WORKSPACE_ROOT)/package-lock.json | jq -r '.packages | to_entries[] | select(.value.name == "@kumahq/config") | .key')
MK := $(KUMAHQ_CONFIG)/src/mk

## make help: if you're aren't sure use `make help`
.DEFAULT_GOAL := help

include $(MK)/index.mk

.PHONY: help
help: .help ## Display this help screen

.PHONY: clean
clean: .clean types/clean ## Dev: Remove all `node_modules` recursively and the cloned kuma repository

.PHONY: install
install: .install ## Dev: Install all dependencies

.PHONY: lint
lint: .lint/js ## Dev: Run lint checks

## When amending the specs also see `make generate/oas-for-ts` in the main kuma
## repository to regenerate the specs before running `make build`
.PHONY: build
build: GIT_SHA?=$(shell $(MAKE) version)
build: kuma/docs/generated/openapi.yaml ## Regenerate the TS types from kumahq/kuma OpenAPI specs whilst applying overlays in ./src
	@echo "Rebuilding types for kumahq/kuma@$(GIT_SHA)"
	@$(MAKE) \
		-f ../config/src/mk/openapi.mk \
			./index.d.ts \
				OPENAPI_SRC=$< \
				OPENAPI_SHA=$(shell $(MAKE) git-version)

.PHONY: version
version: ## Print the version of the OAS spec. In this case it is the full SHA of the kumahq/kuma repository where the OAS spec was generated from
	@$(MAKE) \
		-f ../config/src/mk/openapi.mk \
			version

.PHONY: git-version
git-version:
	@git -C ./kuma describe --always --dirty --abbrev=40

kuma/docs/generated/openapi.yaml:
	@echo "Fetching kumahq/kuma@$(GIT_SHA)..."
	@git clone https://github.com/kumahq/kuma.git \
			--depth 1; \
		cd ./kuma; \
		git fetch --depth 1 origin $(GIT_SHA); \
		git checkout $(GIT_SHA)

types/clean: ## Remove all build artifacts and re-clone upstream using the version specified in ./openapi.yaml#x-oas-source
	@echo "Removing build artifacts and cloned kuma repository at..."
	@echo "./kuma ./generated" \
		| xargs -n1
	@if $(MAKE) -s confirm ; then \
		rm -rf ./kuma; \
		rm -rf ./generated; \
	fi
