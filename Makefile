SHELL := /usr/bin/env bash
MK := ./packages/kuma-gui/mk

ROOT := ./mk

include $(ROOT)/index.mk
include $(MK)/install.mk
include $(MK)/check.mk

.PHONY: clean
clean: .install/clean/workspace ## Dev: Delete all node_modules directories

.PHONY: install
install: .install ## Dev: Install all dependencies
