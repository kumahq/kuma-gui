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
clean: .clean ## Dev: Remove all `node_modules` recursively

.PHONY: install
install: .install ## Dev: Install all dependencies

.PHONY: lint
lint: .lint/js .lint/lock ## Dev: Run lint checks on the workspace root only. Note: individual sub projects have their own `make lint`

.PHONY: bump
bump:
	@$(MAKE) active-branches.json

.PHONY: active-branches.json
active-branches.json:
	@curl -s --fail \
		https://raw.githubusercontent.com/kumahq/kuma/refs/heads/master/active-branches.json \
		> active-branches.json


.PHONY: meta/workspaces
meta/workspaces: .meta/workspaces

.PHONY: meta/packages
meta/packages: .meta/packages

.PHONY: meta/unit
meta/unit: .meta/unit

.PHONY: meta/e2e
meta/e2e: .meta/e2e

.PHONY: meta/preview
meta/preview: .meta/preview
