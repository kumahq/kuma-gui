.PHONY: git/hooks
git/hooks:
	@[ -z "$$(git config core.hooksPath)" ] && env -i PATH="$$PATH" $$($(MAKE) resolve/bin BIN=husky) || true

.PHONY: git/pre-commit
git/pre-commit: LINT_STAGED ?= $(shell $(MAKE) resolve/bin BIN=lint-staged)
git/pre-commit:
	@$(LINT_STAGED)

