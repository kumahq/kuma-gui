# In CI we use a cache id'ed by the has of the package-lock, so they must equal
# each other therefore ignore the age of the package-lock if the cache is found
# if the cache is not found, then node-modules will not exist and be made

# The `touch` is used to ensure node_modules modification date is updated to
# the same as the lockfile. It is possible (via branch switching) to keep
# bumping the date of the lockfile, and a npm install will not bump the date of
# node-modules, the touch make sure the date of node_modules is bumped always
.PHONY: .install
.install: check/node $(NPM_WORKSPACE_ROOT)/node_modules

$(NPM_WORKSPACE_ROOT)/node_modules: $(if $(CI),,$(NPM_WORKSPACE_ROOT)/package-lock.json)
	@cd $(NPM_WORKSPACE_ROOT) \
		&& npm $(if $(CI),clean-install,install) \
					--ignore-scripts \
		&& touch $(NPM_WORKSPACE_ROOT)/node_modules
#
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
