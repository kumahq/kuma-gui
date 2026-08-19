PLAYWRIGHT_MAKEFILE := $(lastword $(MAKEFILE_LIST))
PLAYWRIGHT_MAKEFILE_DIR := $(dir $(abspath $(PLAYWRIGHT_MAKEFILE)))
PLAYWRIGHT ?= $(shell $(MAKE) resolve/bin PACKAGE=@playwright/test BIN=playwright)
BDDGEN ?= $(shell $(MAKE) resolve/bin PACKAGE=playwright-bdd BIN=bddgen)

.PHONY: install
install:
	@$(PLAYWRIGHT) install chromium --with-deps

.PHONY: build
build:
	@$(BDDGEN)

.PHONY: test
test: PLAYWRIGHT_FLAGS=""
test: build $(if $(CI),,install)
	@$(PLAYWRIGHT) test $(PLAYWRIGHT_FLAGS)


