MK := ./src/mk

## make help: if you're aren't sure use `make help`
.DEFAULT_GOAL := help

include $(MK)/check.mk
include $(MK)/help.mk

.PHONY: help
help: .help ## Display this help screen

.PHONY: lint
lint: .lint/script ## Dev: Run all lint script checks (js,ts)
