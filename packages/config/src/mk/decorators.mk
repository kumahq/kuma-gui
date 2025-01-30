.PHONY: ws/%
ws/%: ## Dev: Run the same command in every package in the workspace i.e. `make ws/lint`
	@for dir in $(shell npm query .workspace | jq -r '.[].location'); do \
		$(MAKE) -C $(NPM_WORKSPACE_ROOT)/$$dir $(subst ws/,,$@); \
	done
