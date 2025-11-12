OPENAPI_MAKEFILE := $(lastword $(MAKEFILE_LIST))

OPENAPI_TS ?= $(shell $(MAKE) resolve/bin BIN=openapi-typescript)
OPENAPI_FORMAT ?= $(shell $(MAKE) resolve/bin BIN=openapi-format)

OVERLAY_SRC_FILES := $(shell find ./src -name "*.overlay.yaml" -type f)
OVERLAY_OUTPUT_FILES := $(patsubst ./src/%,./dist/%,$(OVERLAY_SRC_FILES:.overlay.yaml=.yaml))

YAML_SRC_FILES := $(shell find ./src -name "*.yaml" -not -name "*.overlay.yaml" -type f)
YAML_OUTPUT_FILES := $(patsubst ./src/%,./dist/%,$(YAML_SRC_FILES))

index.d.ts: openapi.yaml
	@echo "Generating Types from $< to $@..."
	@$(OPENAPI_TS) $< > $@

openapi.yaml: OPENAPI_SHA?=unknown
openapi.yaml: openapi.overlay.tmpl.yaml generated/openapi.yaml $(OVERLAY_OUTPUT_FILES) $(YAML_OUTPUT_FILES) dist/paths/.yaml
	@echo "Overlaying final $(basename $@).overlay$(suffix $@) to $@..."
	@cat $(basename $@).overlay.tmpl$(suffix $@) | sed "s/\$${GIT_SHA}/$(OPENAPI_SHA)/g" > $(basename $@).overlay$(suffix $@)
	@$(OPENAPI_FORMAT) \
		--keepComments \
		--overlayFile $(basename $@).overlay$(suffix $@) \
		--output $@
	@rm $(basename $@).overlay$(suffix $@)

$(OVERLAY_OUTPUT_FILES): dist/%.yaml: src/%.overlay.yaml
	@echo "Overlaying $< to $@..."
	@mkdir -p $(dir $@)
	@$(OPENAPI_FORMAT) \
		--keepComments \
		--no-bundle \
		--overlayFile $< \
		--output $@

$(YAML_OUTPUT_FILES): dist/%.yaml: src/%.yaml
	@echo "Copying $< to $@..."
	@mkdir -p $(dir $@)
	@cp $< $@

## dist will already exist from previous steps so we use paths/.yaml (which is `/` root)
## to signal that dist needs copying and we then skip anything that exists
dist/paths/.yaml: generated/openapi.yaml
	@echo "Copying generated to dist..."
	@cp -nvR generated/. dist/ || true

generated/openapi.yaml: $(OPENAPI_SRC)
	@echo "Splitting $<..."
	@mkdir -p $(dir $@)
	@$(OPENAPI_FORMAT) \
		--keepComments \
		--split $< \
		--output $@
	@echo "Removing dist to be refreshed..."
	@rm -rf ./dist


.PHONY: version
version:
	@cat openapi.yaml | grep x-oas-source | cut -d'@' -f2
