.PHONY: .build
.build: VITE ?= $(shell $(MAKE) resolve/bin BIN=vite)
.build: $(if $(NOPRUNE),,prune) install
	@$(VITE) \
			--configLoader runner \
			-c ./vite.config.production.ts \
			build

.PHONY: build/preview
build/preview: VITE ?= $(shell $(MAKE) resolve/bin BIN=vite)
build/preview:
	@$(VITE) \
			--configLoader runner \
			-c ./vite.config.development.ts \
			--mode preview \
			build

.PHONY: build/docs
build/docs: VITEPRESS ?= $(shell $(MAKE) resolve/bin BIN=vitepress)
build/docs:
	@$(VITEPRESS) \
		build

.PHONY: deploy/test
deploy/test:
	@rm -rf gui
	@mkdir gui && \
		mv dist/* gui && \
		mv gui dist/gui && \
		mv dist/gui/mockServiceWorker.js dist/

.PHONY: deploy/e2e
deploy/e2e:
	@$(MAKE) build NOPRUNE=1
	@$(MAKE) deploy/test

.PHONY: .deploy/preview
.deploy/preview:
	@$(MAKE) build/preview
	@$(MAKE) deploy/test
