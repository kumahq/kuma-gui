.PHONY: .run
.run: VITE ?= $(shell $(MAKE) resolve/bin BIN=vite)
.run: install
	@$(VITE) \
		--configLoader runner \
		-c ./vite.config.production.ts

.PHONY: .run/docs
.run/docs: VITEPRESS ?= $(shell $(MAKE) resolve/bin BIN=vitepress)
.run/docs: install
	@$(VITEPRESS) \
		dev

.PHONY: .run/e2e
.run/e2e: VITE ?= $(shell $(MAKE) resolve/bin BIN=vite)
.run/e2e:
	@$(MAKE) deploy/e2e
	@$(VITE) \
		--configLoader runner \
		-c ./vite.config.preview.ts \
		preview
