# Syft, used to generate the SBOM, struggles with npm projects when:
# - Two packages, in the same repository, are separate npm workloads
#   which share a common `package-lock.json`.
# - One package (e.g., `packages/config`) defines peerDependencies and
#   is referenced as a devDependency in another package
#   (e.g., `packages/kuma-gui`).
#
# In this setup, regular dependencies of `@kuma/config`, which is
# referenced as a devDependency in `@kuma/kuma-gui`, are incorrectly
# shown as regular dependencies in the SBOM. This happens because
# Syft only considers `package-lock.json` and does not distinguish
# between devDependencies and regular dependencies of a peer package.
#
# According to npm documentation:
# https://docs.npmjs.com/cli/v9/configuring-npm/package-lock-json
# > package-lock.json is automatically generated for any operations
# > where npm modifies either the node_modules tree, or package.json.
# > It describes the exact tree that was generated, such that
# > subsequent installs are able to generate identical trees,
# > regardless of intermediate dependency updates.
#
# The phrase "regardless of intermediate dependency updates" suggest
# that when the `@kuma/config` devDependency is removed from the
# `@kuma/kuma-gui` workload, no package versions of still-used
# dependencies will change during `npm install --package-lock-only`.
# This behavior was manually confirmed.
#
# The `release/prune` target addresses this issue by:
# 1. Removing the `@kuma/config` dependency from
#    `packages/kuma-gui/package.json`.
# 2. Deleting the `packages/config` directory, as the `@kuma/config`
#    package is completely irrelevant for the release and can be safely
#    removed.
# 3. Updating `package-lock.json` using `npm install --package-lock-only`.
#
# This reduces incorrect SBOM entries, decreasing cataloged dependencies
# from 872 to 157 at the time of this change.
.PHONY: .release/prune
.release/prune:
	@if [ -z "$(KUMAHQ_CONFIG)" ]; then \
		echo "Error: KUMAHQ_CONFIG is not set or empty."; \
		exit 1; \
	fi
	@if [ ! -d "$(KUMAHQ_CONFIG)" ]; then \
		echo "Error: KUMAHQ_CONFIG does not exist or is not a directory: $(KUMAHQ_CONFIG)"; \
		exit 1; \
	fi
	@echo '$(shell node -e "console.log(require('@kumahq/config').ci.depsToDevDeps('$(KUMAHQ_CONFIG)/package.json'))")' \
		> $(KUMAHQ_CONFIG)/package.json
	@npm install --package-lock-only
