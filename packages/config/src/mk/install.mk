.PHONY: .install
.install: check/node
	@npm install

.PHONY: .install/sync
.install/sync:
	npm clean-install

.PHONY: .clean
.clean:
	@echo "Recursively removing all node_modules/ directories in $(NPM_WORKSPACE_ROOT)..."
	@find $(NPM_WORKSPACE_ROOT) -name 'node_modules' -type d -prune
	@if $(MAKE) -s confirm ; then \
		find $(NPM_WORKSPACE_ROOT) -name 'node_modules' -type d -prune -exec rm -rf '{}' +; \
	fi
