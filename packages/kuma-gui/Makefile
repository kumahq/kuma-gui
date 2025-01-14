# Please keep this file free of actual scripts
# It should only be used for adding "non-dot" aliases and documentation

SHELL := /usr/bin/env bash
MK := ../config/src/mk
NODE_VERSION:=v$(shell cat ../../.nvmrc)
NPM_WORKFLOW_CONFIG_PATH ?= $(shell readlink -f ../config)

## make help: if you're aren't sure use `make help`
.DEFAULT_GOAL := help

include $(MK)/help.mk
include $(MK)/run.mk
include $(MK)/install.mk
include $(MK)/check.mk
include $(MK)/test.mk
include $(MK)/build.mk
include $(MK)/release.mk

## These make targets are only used by CI and is therefore are not exposed in help
.PHONY: build/sync
build/sync: .build/sync

.PHONY: install/sync
install/sync: .install/sync
### end CI-only scripts

.PHONY: help
help: .help ## Display this help screen

.PHONY: clean
clean: .clean ## Dev: Delete all node_modules directories

.PHONY: install
install: .install ## Dev: install all dependencies (runs before `make run`)

.PHONY: lint
lint: .lint ## Dev: Run lint checks on all languages

.PHONY: lint/script
lint/script: .lint/script ## Dev: Run lint checks on both JS/TS

.PHONY: run
run: .run ## Dev: run local development instance of the GUI. If you are working on the GUI then you are probably looking for this.

.PHONY: run/docs
run/docs: .run/docs ## Dev: run local instance of the GUI docs, either just for reference or contributing.

.PHONY: run/e2e
run/e2e: .run/e2e ## Dev: run local instance of production build (used for e2e testing)

.PHONY: test/unit
test/unit: .test/unit ## Dev: run unit tests and exit

.PHONY: test/unit/watch
test/unit/watch: .test/unit/watch ## Dev: run unit tests but watch for changes

.PHONY: test/e2e
test/e2e: .test/e2e ## Run browser-based e2e tests against a running GUI, you may want to set KUMA_BASE_URL=http://localhost:8080/gui and KUMA_TEST_BROWSER=chrome

.PHONY: build ## Dev: build a production artifact in `./dist`
build: .build

.PHONY: release/prune
release/prune: .release/prune
