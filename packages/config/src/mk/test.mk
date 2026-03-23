.PHONY: test

.PHONY: .test/unit
.test/unit: VITEST ?= $(shell $(MAKE) resolve/bin BIN=vitest)
.test/unit: install
	@TZ=UTC \
		FORCE_COLOR=1 \
		$(VITEST) \
			--configLoader runner \
			-c vite.config.production.ts \
			run

.PHONY: .test/unit/watch
.test/unit/watch: VITEST ?= $(shell $(MAKE) resolve/bin BIN=vitest)
.test/unit/watch: install
	@TZ=UTC \
		FORCE_COLOR=1 \
		$(VITEST) \
			--configLoader runner \
			-c vite.config.production.ts \


.PHONY: .test/e2e
.test/e2e:
