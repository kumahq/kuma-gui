# Please keep this file free of actual scripts
# It should only be used for adding "non-dot" aliases and documentation

SHELL := /usr/bin/env bash

KUMAHQ_CONFIG := $(shell npm query .workspace | jq -r '.[] | select(.name == "@kumahq/config") | .path')
MK := $(KUMAHQ_CONFIG)/src/mk

## make help: if you're aren't sure use `make help`
.DEFAULT_GOAL := help
include $(MK)/help.mk

include $(MK)/install.mk
include $(MK)/check.mk

.PHONY: help
help: .help ## Display this help screen

.PHONY: clean
clean: .clean ## Dev: Remove all `node_modules` recursively

.PHONY: install
install: .install ## Dev: Install all dependencies

.PHONY: lint
lint: .lint/script ## Dev: Run all lint script checks (js,ts)
