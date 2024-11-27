NODE_VERSION?=v$(shell cat .nvmrc)

.PHONY: check/node
check/node:
	@node -v | grep $(NODE_VERSION) &> /dev/null || ( \
		echo "Make sure node-$(NODE_VERSION) is installed (see .nvmrc)"; \
		exit 1; \
	)

.PHONY: .lint
.lint: lint/js lint/ts lint/css lint/lock lint/gherkin

.PHONY: .lint/script
.lint/script: lint/js lint/ts  ## Dev: Run lint checs on both JS/TS

.PHONY: lint/js
lint/js:
	@npx eslint \
		$(if $(CI),,--fix) --ext .js,.ts,.vue,.json \
		.

.PHONY: lint/ts
lint/ts:
	@npx vue-tsc \
		--noEmit

.PHONY: lint/css
lint/css:
	@npx stylelint \
		$(if $(CI),,--fix) --allow-empty-input \
		./src/**/*.{css,scss,vue}

.PHONY: lint/gherkin
lint/gherkin:
	@find ./features \
		-name '*.feature' \
		-exec npx gherkin-utils format '{}' +

.PHONY: lint/lock
lint/lock:
	@npx lockfile-lint \
		--path package-lock.json \
		--allowed-hosts npm \
		--validate-https
