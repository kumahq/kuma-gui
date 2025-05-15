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
		REPLY="" ; \
		read -p "=== Please confirm [y/n]: " -r ; \
		if [[ ! $$REPLY =~ ^[Yy]$$ ]]; then \
			echo $$REPLY ; \
			exit 1 ; \
		else \
			exit 0; \
		fi \
	fi

.PHONY: .meta/workspaces
.meta/workspaces:
	@npm query .workspace | \
		jq -r -c 'map(. + {slug: .name | sub("/";"-") | sub("@";"")}) | .[]' | \
	while read -r workspace; \
	do (printf '{"e2e": %s, "unit": %s, "preview": %s }' \
		$$([[ $$(find $$(echo $$workspace | jq -r '.path') -name "*.feature") ]] && echo 'true' || echo 'false') \
		$$([[ $$(find $$(echo $$workspace | jq -r '.path') -name "*.spec.ts") ]] && echo 'true' || echo 'false') \
		$$([[ $$(find $$(echo $$workspace | jq -r '.path') -maxdepth 1 -name "index.html") ]] && echo 'true' || echo 'false') \
		; echo $$workspace) | jq --slurp add \
	;done | jq --slurp

.PHONY: .meta/packages
.meta/packages:
	@(npm query ':root';$(MAKE) meta/workspaces) | jq --slurp add | \
		jq -r 'map(. + {slug: .name | sub("/";"-") | sub("@";"")})'

.PHONY: .meta/unit
.meta/unit:
	@$(MAKE) meta/workspaces | jq -r 'map(select(.unit == true))'

.PHONY: .meta/e2e
.meta/e2e:
	@$(MAKE) meta/workspaces | jq -r 'map(select(.e2e == true))'

.PHONY: .meta/preview
.meta/preview:
	@$(MAKE) meta/workspaces | jq -r 'map(select(.preview == true))'
