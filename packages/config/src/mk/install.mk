.PHONY: .install
.install: check/node
	@npm install

.PHONY: .install/sync
.install/sync:
	npm clean-install

.PHONY: .clean
.clean:
	@echo "Recursively removing all node_modules/ directories in `pwd`..."; \
		find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +

