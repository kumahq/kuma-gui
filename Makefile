SHELL := /usr/bin/env bash
MK := ./packages/config/src/mk

## make help: if you're aren't sure use `make help`
.DEFAULT_GOAL := help

include $(MK)/install.mk
include $(MK)/check.mk
include $(MK)/help.mk

.PHONY: clean
clean: .clean ## Dev: Remove all `node_modules` recursively

.PHONY: install
install: .install ## Dev: Install all dependencies

.PHONY: help
help: .help ## Display this help screen
