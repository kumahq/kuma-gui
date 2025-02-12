.PHONY: ws/%
ws/%: ## Dev: Run the same command in every package in the workspace i.e. `make ws/lint`
	@for dir in $(shell npm query .workspace | jq -r '.[].location'); do \
		echo "=== Running \`make $(subst ws/,,$@)\` in $$dir ==="; \
		$(MAKE) -C $(NPM_WORKSPACE_ROOT)/$$dir $(subst ws/,,$@); \
		echo ""; \
	done
