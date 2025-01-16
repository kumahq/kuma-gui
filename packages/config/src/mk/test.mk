.PHONY: test

.PHONY: .test/unit
.test/unit: install
	@TZ=UTC \
		FORCE_COLOR=1 \
		npx vitest \
			-c vite.config.production.ts \
			run

.PHONY: .test/unit/watch
.test/unit/watch: install
	@TZ=UTC \
		FORCE_COLOR=1 \
		npx vitest \
			-c vite.config.production.ts \


.PHONY: .test/e2e
.test/e2e: CYPRESS_SPEC?=**/*.feature
.test/e2e:
ifdef KUMA_TEST_BROWSER
	@TZ=UTC \
		npx cypress \
			open \
			--e2e \
			--browser $(KUMA_TEST_BROWSER)
else
	@while ! nc -z localhost 5681; do sleep 1; done;
	@CYPRESS_video=true \
	TZ=UTC \
		npx cypress \
			run \
			--spec $(CYPRESS_SPEC)
endif
