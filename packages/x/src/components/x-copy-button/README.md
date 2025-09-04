# x-copy-button

## x-copy-button-debug

Wraps XCopyButton in a decorator to also `console.log` the text of any copy
(but not `console.error` the text if the copy fails).

The component should always be injected as a replacement for XCopyButton in
debug/dev modes only and never used directly.
