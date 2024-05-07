.PHONY: install
install:
	npm install

.PHONY: install/sync
install/sync:
	npm clean-install

.PHONY: clean
clean: ## Delete all node_modules directories
	find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +