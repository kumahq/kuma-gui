SHELL := /usr/bin/env bash

## make help: if you're aren't sure use `make help`
.DEFAULT_GOAL := help

include mk/help.mk
include mk/run.mk
include mk/install.mk
include mk/check.mk
include mk/test.mk
include mk/build.mk
