OPENAPI_MAKEFILE := $(lastword $(MAKEFILE_LIST))

OPENAPI_TS ?= $(shell $(MAKE) resolve/bin BIN=openapi-typescript)
OPENAPI_FORMAT ?= $(shell $(MAKE) resolve/bin BIN=openapi-format)

OVERLAY_SRC_FILES := $(shell find ./src -name "*.overlay.yaml" -type f)
OVERLAY_OUTPUT_FILES := $(patsubst ./src/%,./dist/%,$(OVERLAY_SRC_FILES:.overlay.yaml=.yaml))

YAML_SRC_FILES := $(shell find ./src -name "*.yaml" -not -name "*.overlay.yaml" -type f)
YAML_OUTPUT_FILES := $(patsubst ./src/%,./dist/%,$(YAML_SRC_FILES))

index.d.ts: openapi.yaml
	@$(OPENAPI_TS) $< > $@

openapi.yaml: ./dist overlays
	@$(OPENAPI_FORMAT) \
		--keepComments \
		--overlayFile $(basename $@).overlay$(suffix $@) \
		--output $@

./dist/%.yaml: ./src/%.yaml
	@cp $< $@

./dist: ./generated/openapi.yaml
	@cp -R $(dir $<) $@
	@$(MAKE) -f $(OPENAPI_MAKEFILE) $(YAML_OUTPUT_FILES)

.PHONY: overlays
overlays: ./generated/openapi.yaml
	@rm -f $(OVERLAY_OUTPUT_FILES)
	@$(MAKE) -f $(OPENAPI_MAKEFILE) $(OVERLAY_OUTPUT_FILES)

%.yaml: %.overlay.yaml
	@mkdir -p $(dir $@)
	@$(OPENAPI_FORMAT) \
		--keepComments \
		--no-bundle \
		--overlayFile $< \
		--output $@

./generated/openapi.yaml: $(OPENAPI_SRC)
	@mkdir -p $(dir $@)
	@$(OPENAPI_FORMAT) \
		--keepComments \
		--split $< \
		--output $@




