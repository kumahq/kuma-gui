# Please keep this file free of actual scripts
# It should only be used for adding "non-dot" aliases and documentation

SHELL := /usr/bin/env bash

NPM_WORKSPACE_ROOT := $(shell npm prefix)
KUMAHQ_CONFIG := $(NPM_WORKSPACE_ROOT)/$(shell cat $(NPM_WORKSPACE_ROOT)/package-lock.json | jq -r '.packages | to_entries[] | select(.value.name == "@kumahq/config") | .key')
MK := $(KUMAHQ_CONFIG)/src/mk

## make help: if you're aren't sure use `make help`
.DEFAULT_GOAL := help
include $(MK)/help.mk

include $(MK)/install.mk
include $(MK)/check.mk

.PHONY: help
help: .help ## Display this help screen

.PHONY: clean
clean: .clean types/clean ## Dev: Remove all `node_modules` recursively and the cloned kuma repository

.PHONY: install
install: .install ## Dev: Install all dependencies

.PHONY: lint
lint: lint/js ## Dev: Run lint checks

## When amending the specs also see `make generate/oas-for-ts` in the main kuma
## repository to regenerate the specs before running `make build`
KUMAHQ_HTTP_API := $(NPM_WORKSPACE_ROOT)/$(shell cat $(NPM_WORKSPACE_ROOT)/package-lock.json | jq -r '.packages | to_entries[] | select(.value.name == "@kumahq/kuma-http-api") | .key')

CLONE :=
ifndef CI
CLONE += types/clone
endif

build: LOCAL_SPEC := $(KUMAHQ_HTTP_API)/kuma/docs/generated/openapi.yaml
build: REMOTE_SPEC := https://raw.githubusercontent.com/kumahq/kuma/refs/heads/master/docs/generated/openapi.yaml
.PHONY: build
build: install $(CLONE) ## Regenerate the TS types from kumahq/kuma OpenAPI specs
	@npx openapi-typescript \
		$(if $($CLONE),$(LOCAL_SPEC),$(REMOTE_SPEC)) \
		-o $(KUMAHQ_HTTP_API)/index.d.ts

# if SHA is master we clone, or if its there already pull
# otherwise, shallow clone the specific SHA
# TBH we should check the SHA is equal in the second case and maybe rm -rf
# ./kuma first but the use case is so unlikely, if anyone wants please go
# ahead and add
.PHONY: types/clone
types/clone: SHA?=master
types/clone:
	@echo "Fetching kumahq/kuma@$(SHA) ..."
	@cd $(KUMAHQ_HTTP_API) \
		&& \
			if [ -d "./kuma/.git" ]; then \
				if [ "$(SHA)" == "master" ]; then \
					cd ./kuma \
						&& git pull; \
				fi; \
			else \
				if [ "$(SHA)" == "master" ]; then \
					git clone \
						--depth 1 \
						https://github.com/kumahq/kuma.git; \
				else \
					mkdir -p ./kuma \
					&& cd ./kuma \
					&& git init -b master \
					&& git remote add origin https://github.com/kumahq/kuma.git \
					&& git fetch --depth 1 origin $(SHA) \
					&& git checkout FETCH_HEAD; \
				fi; \
			fi

.PHONY: types/clean
types/clean:
	@echo "Removing cloned kuma repository at..."
	@echo "$(KUMAHQ_HTTP_API)/kuma..."
	@if $(MAKE) -s confirm ; then \
		rm -rf $(KUMAHQ_HTTP_API)/kuma; \
	fi
