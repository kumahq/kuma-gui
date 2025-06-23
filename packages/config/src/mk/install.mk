.PHONY: .install
.install: check/node $(NPM_WORKSPACE_ROOT)/node_modules

$(NPM_WORKSPACE_ROOT)/node_modules: $(NPM_WORKSPACE_ROOT)/package-lock.json
	@cd $(NPM_WORKSPACE_ROOT) \
		&& npm $(if $(CI),clean-install,install) \
					--ignore-scripts

.PHONY: .sync
.sync: check/node
	@cd $(NPM_WORKSPACE_ROOT) \
		&& npm install \
					--package-lock-only \
					--prefer-dedupe \
					--ignore-scripts

.PHONY: .clean
.clean:
	@echo "Recursively removing all node_modules/ directories in $(NPM_WORKSPACE_ROOT)..."
	@find $(NPM_WORKSPACE_ROOT) -name 'node_modules' -type d -prune
	@if $(MAKE) -s confirm ; then \
		find $(NPM_WORKSPACE_ROOT) -name 'node_modules' -type d -prune -exec rm -rf '{}' +; \
	fi

.PHONY: .post-upgrade/msw
.post-upgrade/msw: MSW ?= $(shell $(MAKE) resolve/bin BIN=msw)
.post-upgrade/msw:
	@$(MSW) init
