SHELL := /usr/bin/env bash
MK := ./packages/kuma-gui/mk

include $(MK)/install.mk
include $(MK)/check.mk

.PHONY: clean
clean:
	@echo "Recursively removing all node_modules/ directories in `pwd`..."; \
		$(MAKE) .clean

.PHONY: install
install: .install ## Dev: Install all dependencies
