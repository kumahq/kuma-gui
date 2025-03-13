.PHONY: check/node
check/node: NPM_VERSION:=v$(shell cat $(NPM_WORKSPACE_ROOT)/package.json | jq -r '.engines.npm')
check/node: NODE_VERSION:=v$(shell grep -v -e "^#" -e "^$$" $(NPM_WORKSPACE_ROOT)/.nvmrc)
check/node:
	@node -v | grep $(NODE_VERSION) &> /dev/null || ( \
		echo "Make sure node-$(NODE_VERSION) is installed (please see .nvmrc for nvm installation)"; \
		echo ""; \
		echo "TLDR:"; \
		echo "---"; \
		echo "You can run \`nvm install\` if you have nvm installed, otherwise to install nvm run"; \
		echo "\`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash\`"; \
		echo "Once it's installed, run \`nvm install\`"; \
		echo "---"; \
		echo ""; \
		echo "With the correct version of node is installed, then you can re-run your make target"; \
		exit 1; \
	)
	@npm ls -g "npm@$(NPM_VERSION)" | grep "empty" > /dev/null && ( \
		echo "Make sure npm@$(NPM_VERSION) is installed. Try npm install -g npm@$(NPM_VERSION)"; \
		exit 1; \
	) || (exit 0)

.PHONY: .lint
.lint: lint/js lint/ts lint/css lint/lock lint/gherkin

.PHONY: .lint/script
.lint/script: lint/js lint/ts  ## Dev: Run lint checks on both JS/TS

.PHONY: lint/js
lint/js:
	@npx eslint \
		$(if $(CI),,--fix) \
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
