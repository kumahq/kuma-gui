# @kumahq packages

For more detailed information for each package, see the package README.md or
run `make help` inside the package for a list of available make
targets/engineering utilities.

- **[@kumahq/config](./config)** - Shared development tooling configuration (TypeScript,
ESLint, Playwright, Cypress, Vite, OpenAPI) for use across packages in this
repository.
- **[@kumahq/container](./container)** - Lightweight dependency injection container using
BrandiJS with token-based service registration for managing application
dependencies.
- **[@kumahq/data](./data)** - Vue components (`DataSource` and `DataLoader`) for
handling external data fetching, loading states, and error handling.
- **[@kumahq/fake-api](./fake-api)** - Utilities for loading and serving mock HTTP API
responses with generated fake data via FakerJS for development and testing.
- **[@kumahq/gherkin-web](./gherkin-web)** - Gherkin/Cucumber step definitions for testing web
applications, with support for both Playwright and Cypress runners.
- **[@kumahq/kuma-gui](./kuma-gui)** - The main Vue 3 single-page application for managing
Kuma Service Mesh.
- **[@kumahq/kuma-http-api](./kuma-http-api)** - TypeScript types generated from the Kuma OpenAPI
specification, with overlays that fix type mismatches and improve schema
accuracy.
- **[@kumahq/routing](./routing)** - Routing utilities and Vue components (e.g. `RouteView`,
`RouteTitle`) for building route-aware Vue applications.
- **[@kumahq/settings](./settings)** - Utilities for managing environment variables and
feature flags through build-time and runtime configuration, including
capability checks via the `can` function.
- **[@kumahq/x](./x)** - Application-level UI components that wrap and enhance native
Vue components and Kongponents for use across the GUI.
