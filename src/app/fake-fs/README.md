---
section: Packages
---
# fake-fs

A module for generating massive amounts of randomized mock API responses. The
responses can be served via various method depending on environment such as:

- Server based such as via `express` or similar during local development.
- Service Worker based such as via `msw` or similar for serving mocks via
  static environments.
- Browser runner based such as via `cypress` or `playwright` or similar for
  serving mock during browser testing.

