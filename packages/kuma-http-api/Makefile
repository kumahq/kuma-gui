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
build: ## Regenerate the TS types from kumahq/kuma OpenAPI specs
	@$(MAKE) \
		-f ../config/src/mk/openapi.mk \
			./index.d.ts \
				OPENAPI_SRC=./kuma/docs/generated/openapi.yaml

types/fetch:
	@echo "Fetching latest kumahq/kuma@master..."
	@if [ -d "./kuma/.git" ]; then \
		cd ./kuma \
			&& git pull; \
	else \
		git clone https://github.com/kumahq/kuma.git \
			--single-branch --branch=master \
			--depth 1; \
	fi

types/clean:
	@echo "Removing build artifacts and cloned kuma repository at..."
	@echo "./kuma..."
	@if $(MAKE) -s confirm ; then \
		rm -rf ./kuma; \
		rm -rf ./build ./dist ./generated openapi.yaml index.d.ts; \
	fi
