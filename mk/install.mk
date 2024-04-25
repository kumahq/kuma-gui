.PHONY: install
install:
	yarn install

.PHONY: install/sync
install/sync:
	yarn install --frozen-lockfile

.PHONY: clean
clean: ## Delete all node_modules directories
	find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +
