SCRIPT_RUNNER := npm run


.PHONY: .run
.run: install
	@NODE_OPTIONS=--experimental-strip-types \
		npx vite \
		-c ./vite.config.development.ts

.PHONY: .run/docs
.run/docs: install
	@npx vitepress \
		dev

.PHONY: .run/e2e
.run/e2e:
	@$(MAKE) deploy/e2e
	@npx vite \
		-c ./vite.config.preview.ts \
		preview
