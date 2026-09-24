# Data fetching

* Status: accepted

## Technical story

Implementation of a declarative approach of fetching data which is type-safe, efficient and provides consistent representations of loader, error and success states.

## Context and Problem Statement

Without a standardized approach, there is always a risk that individuals are implementing different patterns for data fetching, loading states, error handling, and potentially data caching. This could easily lead to inconsistent user experiences and code that is difficult to maintain.

Many libraries for data fetching in Vue applications provide hooks other other imperative ways to fetch data from an API. We prefer a declarative approach that abstracts away the loading and error states, such that we can minimize any conditions in the template.

In most cases we need to block the rendering of sub-trees to show a loading indicator until the requests are settled. But in some cases we need to share the same data across different views or routes. We want to avoid relying on or implementing any caching strategies and instead in case of caching only rely on browser defaults.

## Decision Drivers

* Need for consistent loading and error states across the application
* Requirement for declarative data fetching that integrates well with Vue's reactive system  
* Desire to minimize boilerplate code for common data fetching patterns
* Need for automatic data sharing and caching to reduce redundant API calls
* Requirement for proper error handling and retry mechanisms
* Need to support both blocking and non-blocking loading scenarios
* Type safety with TypeScript integration

## Considered Options

_TBD_

## Decision Outcome

We chose to implement a declarative data fetching system using custom Vue components: `DataSource` and `DataLoader`. This approach provides a template-first API that integrates naturally with Vue's component model while abstracting away the complexity of data management.

The system consists of the following additional layers and components:
- API-layer for URI-based resource identification with typed parameter extraction
- Data-layer for data modeling and removing sharp edges from the payloads in order to ensure type-safe data access
- `DataSourcePool` for automatic data source pooling to share connections/requests
- `CallableEventSource` for an event-driven architecture behind the scenes

### Positive Consequences

* Separation of concerns in separate layers
* Clear separation between data fetching logic and presentation logic
* Consistent patterns for loading states, error handling, and data presentation across the application
* Automatic data sharing and caching through the DataSourcePool reduces redundant API calls
* Less boilerplate code in components and views
* Type-safe URI patterns with proper TypeScript integration and parameter validation
* Support for both blocking (DataLoader) and non-blocking (DataSource) patterns

### Negative Consequences

* Additional learning curve for developers unfamiliar with the declarative pattern
* Requires understanding of the URI-to-source mapping system

## Implementation Details

For details around the implementation and examples of how and when to use `DataSource` and `DataLoader` please refer to [`@kumahq/data/vue/components`](https://github.com/kumahq/kuma-gui/blob/master/packages/data/src/vue/components/README.md).
