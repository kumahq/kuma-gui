
resolve/bin:
	@cd $(KUMAHQ_CONFIG) && \
		node -e \
			"const p = require.resolve('$(BIN)/package.json');const { dirname, resolve } = require('path'); console.log(resolve(dirname(p), require(p).bin['$(BIN)']))"
.PHONY: check/node
check/node: NPM_VERSION:=$(shell cat $(NPM_WORKSPACE_ROOT)/package.json | jq -r '.engines.npm')
check/node: NODE_VERSION:=v$(shell head -n1 $(NPM_WORKSPACE_ROOT)/.nvmrc)
check/node:
	@node -v | grep $(NODE_VERSION) &> /dev/null || ( \
		echo "Make sure node-$(NODE_VERSION) is installed (please see the root .nvmrc for nvm installation)"; \
		echo "Once the correct version of node is installed, re-run your make target"; \
		exit 1; \
	)
	@npm ls -g "npm@$(NPM_VERSION)" | grep "empty" > /dev/null && ( \
		echo "Make sure npm@$(NPM_VERSION) is installed. Try npm install -g npm@$(NPM_VERSION)"; \
		exit 1; \
	) || (exit 0)

.PHONY: .lint
.lint: lint/js lint/ts lint/css lint/lock lint/gherkin

.PHONY: .lint/script
.lint/script: lint/js lint/ts ## Dev: Run lint checks on both JS/TS

.PHONY: lint/js
lint/js:
	@npx eslint \
		--cache \
		$(if $(CI),,--fix) \
		.

.PHONY: lint/ts
lint/ts: TSC ?= $(shell $(MAKE) resolve/bin BIN=vue-tsc)
lint/ts:
	@$(TSC) \
		--noEmit

.PHONY: lint/css
lint/css:
	@npx stylelint \
		$(if $(CI),,--fix) --allow-empty-input \
		./src/**/*.{css,scss,vue}

.PHONY: lint/gherkin
lint/gherkin:
	@find ./features \
		-name '*.feature' \
		-exec npx gherkin-utils format '{}' +

.PHONY: lint/lock
lint/lock:
	@npx lockfile-lint \
		--path package-lock.json \
		--allowed-hosts npm \
		--validate-https
