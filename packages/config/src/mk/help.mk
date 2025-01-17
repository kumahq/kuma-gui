NPM_WORKSPACE_ROOT := $(shell npm prefix)
NODE_VERSION := v$(shell cat $(NPM_WORKSPACE_ROOT)/.nvmrc)
KUMAHQ_CONFIG := $(shell npm query .workspace | jq -r '.[] | select(.name == "@kumahq/config") | .path')

.PHONY: .help
.help: ## Display this help screen
	@echo "The following targets can be used by running \`make <target>\` in this directory:"; echo "---"
	@# Display top-level targets since they are the ones most developers will need.
	@grep -h -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort -k1 | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
	@# Now show hierarchical targets in separate sections.
	@grep -h -E '^[a-zA-Z0-9_-]+/[%a-zA-Z0-9/_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk '{print $$1}' | \
		awk -F/ '{print $$1}' | \
		sort -u | \
	while read section ; do \
		echo; \
		grep -h -E "^$$section/[^:]+:.*?## .*$$" $(MAKEFILE_LIST) | sort -k1 | \
			awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' ; \
	done

.PHONY: confirm
confirm:
	@if [[ -z "$(CI)" ]]; then \
		CONFIRM="" ; \
		read -p "=== Please confirm [y/n]: " -r ; \
		if [[ ! $$CONFIRM =~ ^[Yy]$$ ]]; then \
			echo "Aborting" ; \
			exit 1 ; \
		else \
			exit 0; \
		fi \
	fi


