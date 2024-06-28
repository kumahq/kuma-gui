.PHONY: test

.PHONY: test/unit
test/unit: install ## Dev: run unit tests and exit
	@TZ=UTC \
		FORCE_COLOR=1 \
		npx vitest \
			-c vite.config.production.ts \
			run

.PHONY: test/unit/watch
test/unit/watch: install ## Dev: run unit tests but watch for changes
	@TZ=UTC \
		FORCE_COLOR=1 \
		npx vitest \
			-c vite.config.production.ts \


.PHONY: test/e2e
test/e2e: ## Run browser-based e2e tests against a running GUI, you may want to set KUMA_BASE_URL=http://localhost:8080/gui and KUMA_TEST_BROWSER=chrome
ifdef KUMA_TEST_BROWSER
	@TZ=UTC \
		npx cypress \
			open \
			--e2e \
			--browser $(KUMA_TEST_BROWSER)
else
	@CYPRESS_video=true \
	TZ=UTC \
		npx cypress \
			run \
			--spec $(CYPRESS_SPEC)
endif
