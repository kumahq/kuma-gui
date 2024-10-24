.PHONY: .install
.install: check/node
	@npm install

.PHONY: .install/sync
.install/sync:
	npm clean-install

.PHONY: .clean
.clean:
	find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +

