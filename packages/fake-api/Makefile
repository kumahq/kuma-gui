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
lint: .lint/script ## Dev: Run lint checks
