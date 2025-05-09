.PHONY: .run
.run: VITE ?= $(shell $(MAKE) resolve/bin BIN=vite)
.run: install
	@NODE_OPTIONS=--experimental-strip-types \
		$(VITE) \
		-c ./vite.config.development.ts

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
		-c ./vite.config.preview.ts \
		preview
