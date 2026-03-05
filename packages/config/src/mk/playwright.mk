PLAYWRIGHT_MAKEFILE := $(lastword $(MAKEFILE_LIST))
PLAYWRIGHT_MAKEFILE_DIR := $(dir $(abspath $(PLAYWRIGHT_MAKEFILE)))
PLAYWRIGHT ?= $(shell $(MAKE) resolve/bin PACKAGE=@playwright/test BIN=playwright)
BDDGEN ?= $(shell $(MAKE) resolve/bin PACKAGE=playwright-bdd BIN=bddgen)

.PHONY: build
build:
	@$(BDDGEN)

.PHONY: test
test: build
	@$(PLAYWRIGHT) test \
		--fully-parallel \
		-x


