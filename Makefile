SHELL := /usr/bin/env bash
MK := ./packages/kuma-gui/mk

include $(MK)/install.mk
include $(MK)/check.mk

.PHONY: clean
clean: .clean ## Dev: Remove all `node_modules` recursively

.PHONY: install
install: .install ## Dev: Install all dependencies
