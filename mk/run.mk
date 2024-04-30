SCRIPT_RUNNER := npm run

run/%: ## Dev: Run any package script using the form `run/name-of-script`
	@$(SCRIPT_RUNNER) $*

.PHONY: run
run: install ## Dev: run local development instance of the GUI. If you are working on the GUI then you are probably looking for this
	@$(MAKE) run/dev

