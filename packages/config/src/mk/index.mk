GNUMAKEFLAGS=--no-print-directory
NPM_WORKSPACE_ROOT := $(shell npm prefix)
KUMAHQ_CONFIG := $(NPM_WORKSPACE_ROOT)/$(shell cat $(NPM_WORKSPACE_ROOT)/package-lock.json | jq -r '.packages | to_entries[] | select(.value.name == "@kumahq/config") | .key')

include $(MK)/help.mk

include $(MK)/decorators.mk
include $(MK)/run.mk
include $(MK)/install.mk
include $(MK)/check.mk
include $(MK)/test.mk
include $(MK)/build.mk
include $(MK)/release.mk

