# DebugKClipboardProvider

Wraps KClipboardProvider in a decorator to also `console.log` the text of any
copy (and also `console.error` the text if the copy fails).

The component should always be injected as a replacement for KClipboardProvider
in debug/dev modes only and never used directly.
