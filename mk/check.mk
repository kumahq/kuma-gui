NODE_VERSION?=v$(shell cat .nvmrc)

.PHONY: check/node
check/node:
	@node -v | grep $(NODE_VERSION) &> /dev/null || ( \
		echo "Make sure node-$(NODE_VERSION) is installed (see .nvmrc)"; \
		exit 1; \
	)

.PHONY: lint
lint: ## Dev: Run lint checks on all languages
	@$(MAKE) run/lint
	@$(MAKE) run/lint:ts
	@$(MAKE) run/lint:styles
	@$(MAKE) run/lint:lockfile

