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
KUMAHQ_HTTP_API := $(NPM_WORKSPACE_ROOT)/$(shell cat $(NPM_WORKSPACE_ROOT)/package-lock.json | jq -r '.packages | to_entries[] | select(.value.name == "@kumahq/kuma-http-api") | .key')
.PHONY: build
build: OPENAPI_TS ?= $(shell $(MAKE) resolve/bin BIN=openapi-typescript)
build: OPENAPI_OVERLAYS ?= $(shell $(MAKE) resolve/bin BIN=overlayjs PACKAGE=openapi-overlays-js)
build: types/fetch install ## Regenerate the TS types from kumahq/kuma OpenAPI specs
	@$(OPENAPI_OVERLAYS) \
		--openapi $(KUMAHQ_HTTP_API)/kuma/docs/generated/openapi.yaml \
		--overlay ./src/overlays/index.yaml > openapi.yaml

	@$(OPENAPI_TS) \
		$(KUMAHQ_HTTP_API)/openapi.yaml \
		-o $(KUMAHQ_HTTP_API)/index.d.ts

types/fetch:
	@echo "Fetching latest kumahq/kuma@master..."
	@cd $(KUMAHQ_HTTP_API) \
		&& \
			if [ -d "./kuma/.git" ]; then \
				cd ./kuma \
					&& git pull; \
			else \
				git clone https://github.com/kumahq/kuma.git \
					--single-branch --branch=master \
					--depth 1; \
			fi

types/clean:
	@echo "Removing cloned kuma repository at..."
	@echo "$(KUMAHQ_HTTP_API)/kuma..."
	@if $(MAKE) -s confirm ; then \
		rm -rf $(KUMAHQ_HTTP_API)/kuma; \
	fi
