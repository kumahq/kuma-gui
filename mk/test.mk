.PHONY: test

.PHONY: test/unit
test/unit: check/node ## Dev: run unit tests.
	@$(MAKE) run/test

.PHONY: test/e2e
test/e2e: check/node ## Dev: run in-browser e2e tests against a running `make run` and a mocked HTTP API
	@$(MAKE) run/test:browser:view

