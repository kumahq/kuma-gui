FILE_DIR := $(dir $(realpath $(lastword $(MAKEFILE_LIST))))

.PHONY: .install/clean/workspace
.install/clean/workspace:
	@cd $(FILE_DIR).. && \
		echo "Recursively removing all node_modules/ directories in `pwd`..."; \
		$(MAKE) .clean
