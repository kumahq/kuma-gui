NODE_VERSION?=v$(shell cat .nvmrc)

.PHONY: check/node
check/node:
	@node -v | grep $(NODE_VERSION) &> /dev/null || ( \
		echo "Make sure node-$(NODE_VERSION) is installed (see .nvmrc)"; \
		exit 1; \
	)

.PHONY: lint
lint: MAKEFLAGS += -j4
lint: lint/js lint/ts lint/css lint/lock  ## Dev: Run lint checks on all languages

.PHONY: lint/js
lint/js:
	@npx eslint \
		$(if $(CI),,--fix) --ext .js,.ts,.vue \
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

.PHONY: lint/lock
lint/lock:
	@npx lockfile-lint \
		--path package-lock.json \
		--allowed-hosts npm \
		--validate-https
