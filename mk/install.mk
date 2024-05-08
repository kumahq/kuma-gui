.PHONY: install
install: check/node ## Dev: install all dependencies
	@npm install

.PHONY: install/sync
install/sync:
	npm clean-install

.PHONY: clean
clean: ## Dev: Delete all node_modules directories
	find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +

