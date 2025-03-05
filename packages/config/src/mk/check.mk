NODE_VERSION?=v$(shell cat .nvmrc)
NPM_VERSION?=$(shell cat $(NPM_WORKSPACE_ROOT)/package.json | jq -r '.engines.npm')

.PHONY: check/node
check/node:
	@node -v | grep $(NODE_VERSION) &> /dev/null || ( \
		echo "Make sure node-$(NODE_VERSION) is installed (see .nvmrc)"; \
		exit 1; \
	)
	@npm ls -g "npm@$(NPM_VERSION)" | grep "empty" > /dev/null && ( \
		echo "Make sure npm@$(NPM_VERSION) is installed. Try npm install -g npm@$(NPM_VERSION)"; \
		exit 1; \
	) || (exit 0)

.PHONY: .lint
.lint: lint/js lint/ts lint/css lint/lock lint/gherkin

.PHONY: .lint/script
.lint/script: ARGS=$(filter-out $@,$(MAKECMDGOALS))
.lint/script:
	@$(MAKE) lint/js $(ARGS)
	@$(MAKE) lint/ts $(ARGS)

.PHONY: lint/js
lint/js: ARGS=$(filter-out $@,$(MAKECMDGOALS))
lint/js:
	@npx eslint \
		$(if $(CI),,--fix) \
		$(if $(ARGS),$(ARGS),.)

.PHONY: lint/ts
lint/ts:
	@npx vue-tsc \
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
