.PHONY: install
install:
	yarn install

.PHONY: install/sync
install/sync:
	make install

.PHONY: clean-install
clean-install:
	yarn install --frozen-lockfile

.PHONY: clean-install/sync
clean-install/sync:
	make clean-install

.PHONY: clean
clean: ## Delete all node_modules directories
	find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +
