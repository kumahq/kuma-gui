# Syft, used to generate the SBOM, struggles with npm projects where:
# - One package (e.g., `packages/config`) defines peerDependencies.
# - Another package (e.g., `packages/kuma-gui`) relies on the first, with the same dependencies in devDependencies.
# Syft only considers `package-lock.json`, so it incorrectly includes peerDependencies in the SBOM as direct dependencies.
# The `release/prune` target addresses this by:
# 1. Removing the `@kuma/config` dependency from `packages/kuma-gui/package.json`.
# 2. Deleting the `packages/config` directory.
# 3. Updating `package-lock.json`.
# This reduces incorrect SBOM entries, decreasing cataloged dependencies from 872 to 157 at the time of this change.
.PHONY: .release/prune
.release/prune:
	@if [ -z "$(NPM_WORKFLOW_CONFIG_PATH)" ]; then \
		echo "Error: NPM_WORKFLOW_CONFIG_PATH is not set or empty."; \
		exit 1; \
	fi
	@if [ ! -d "$(NPM_WORKFLOW_CONFIG_PATH)" ]; then \
		echo "Error: NPM_WORKFLOW_CONFIG_PATH does not exist or is not a directory: $(NPM_WORKFLOW_CONFIG_PATH)"; \
		exit 1; \
	fi
	npm pkg delete devDependencies.@kumahq/config
	rm -rf $(NPM_WORKFLOW_CONFIG_PATH)
	npm install --package-lock-only
