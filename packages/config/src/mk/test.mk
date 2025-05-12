.PHONY: test

.PHONY: .test/unit
.test/unit: VITEST ?= $(shell $(MAKE) resolve/bin BIN=vitest)
.test/unit: install
	@TZ=UTC \
		FORCE_COLOR=1 \
		NODE_OPTIONS=--experimental-strip-types \
		$(VITEST) \
			-c vite.config.production.ts \
			run

.PHONY: .test/unit/watch
.test/unit/watch: VITEST ?= $(shell $(MAKE) resolve/bin BIN=vitest)
.test/unit/watch: install
	@TZ=UTC \
		FORCE_COLOR=1 \
		NODE_OPTIONS=--experimental-strip-types \
		$(VITEST) \
			-c vite.config.production.ts \


.PHONY: .test/e2e
.test/e2e: CYPRESS ?= $(shell $(MAKE) resolve/bin BIN=cypress)
.test/e2e: CYPRESS_SPEC?=**/*.feature
.test/e2e:
	@$(CYPRESS) install
ifdef KUMA_TEST_BROWSER
	@TZ=UTC \
		$(CYPRESS) \
			open \
			--e2e \
			--browser $(KUMA_TEST_BROWSER)
else
	@while ! nc -z localhost 5681; do sleep 1; done;
	@CYPRESS_video=true \
	TZ=UTC \
		$(CYPRESS) \
			run \
			--spec $(CYPRESS_SPEC)
endif
