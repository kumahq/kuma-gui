.PHONY: install
install:
	yarn install

.PHONY: clean-install
clean-install:
	yarn install --frozen-lockfile

.PHONY: clean
clean: ## Delete all node_modules directories
	find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +
