# Ensure a package is a singleton at specified version, use PACKAGE=name and VERSION=0.0.0 variables
node/deps/singleton:
	@if version=$$(npm query \
		--package-lock-only \
		--expect-result-count 1 \
			"[name=\"$(PACKAGE)\"]" \
	| jq -r '.[0] | .version') && [ "$(VERSION)" = "$$version" ]; then \
		echo "$(PACKAGE)@$(VERSION)"; \
	else \
		exit 1; \
	fi
