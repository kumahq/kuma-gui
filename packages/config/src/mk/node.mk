# Ensure a package is a singleton, optionally at specified version
# Use PACKAGE=name (required) and VERSION=0.0.0 (optional) variables
node/deps/singleton:
	@if version=$$(npm query \
		--package-lock-only \
		--expect-result-count 1 \
			"[name=\"$(PACKAGE)\"]" \
	| jq -r '.[0] | .version') && { [ -z "$(VERSION)" ] || [ "$(VERSION)" = "$$version" ]; }; then \
		echo "$(PACKAGE)@$(VERSION) is a singleton"; \
	else \
		echo "$(PACKAGE)@$(VERSION) is not a singleton"; \
		exit 1; \
	fi

