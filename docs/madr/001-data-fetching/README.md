# Data fetching

* Status: accepted

## Technical story

Implementation of a declarative approach of fetching data which is type-safe, efficient and provides consistent representations of loader, error and success states.

## Context and Problem Statement

Without a standardized approach, there is always a risk that individuals are implementing different patterns for data fetching, loading states, error handling, and potentially data caching. This could easily lead to inconsistent user experiences and code that is difficult to maintain.

Many libraries for data fetching in Vue applications provide hooks or other imperative ways to fetch data from an API. We prefer a declarative approach that abstracts away the loading and error states, such that we can minimize any conditions in the template.

In most cases we need to block the rendering of sub-trees to show a loading indicator until the requests are settled. But in some cases we need to share the same data across different views or routes. We want to avoid implementing any caching strategies beyond what is needed to prevent loading indicators from flashing while data is revalidated, and otherwise only rely on browser defaults.

## Decision Drivers

* Need for consistent loading and error states across the application
* Requirement for declarative data fetching that integrates well with Vue's reactive system  
* Desire to minimize boilerplate code for common data fetching patterns
* Need for automatic sharing of requests and responses to reduce redundant API calls and keep different areas of a page in sync
* Requirement for proper error handling and retry mechanisms
* Need to support both blocking and non-blocking loading scenarios
* Type safety with TypeScript integration

## Considered Options

* Imperative fetching in each view (ad-hoc API calls with local state and a global store for shared data)
* A composable/hook-based data fetching library
* Declarative data fetching via components (`DataSource` and `DataLoader`)

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
* Automatic request and response sharing through the DataSourcePool reduces redundant API calls and keeps different areas of a page in sync
* Less boilerplate code in components and views
* Type-safe URI patterns with proper TypeScript integration and parameter validation
* Support for both blocking (DataLoader) and non-blocking (DataSource) patterns
* A custom, in-house solution that we own, fully control and less dependencies

### Negative Consequences

* Additional learning curve for developers unfamiliar with the declarative pattern
* Requires understanding of the URI-to-source mapping system
* A custom, in-house solution that we have to maintain ourselves

## Pros and Cons of the Options

### Imperative fetching in each view

This was the approach before the introduction of `DataSource` (see the `PolicyListView` before and after [kumahq/kuma-gui#1122](https://github.com/kumahq/kuma-gui/pull/1122/changes#diff-15b4ba78b79c8245ad6c3be64f3cf17c428c9de4cb80d83cb54f1382786ebf14)). Each view calls the API client directly in its `<script>`, tracks `isLoading`, `error` and the response in local `ref`s, handles errors in a `try/catch` and keeps state that is needed elsewhere in a global store.

* Good, because it requires no additional abstractions and is easy to follow for a single request
* Bad, because every view re-implements loading, error and empty-state handling, which leads to inconsistent behavior
* Bad, because pagination and selection state is synced to the URL by hand (e.g. `QueryParameter.set`) and needs to be kept in sync with local state
* Bad, because sharing data between views requires a global store, which couples views to it and makes it unclear when the data is refreshed
* Bad, because the same data requested in different areas of a page results in duplicate requests or has to be passed around manually
* Bad, because there is no common place to add polling, background reloading or error retries

### A composable/hook-based data fetching library

Libraries in this category (for example TanStack Query or VueUse's `useFetch`) expose the fetching state through composables that are called in `<script setup>`.

* Good, because they are well-known, documented and maintained outside of this project
* Good, because many provide features such as request deduplication, background revalidation and retries out of the box
* Bad, because the loading and error states still have to be handled with conditions in every template
* Bad, because the data is fetched imperatively in the `<script>`, which makes the result less obvious to read next to the markup that uses it
* Bad, because they commonly ship their own caching strategy, which we want to avoid
* Bad, because they add a dependency whose model and typing need to be adapted to our URI-based API layer and data layer

### Declarative data fetching via components

`DataSource` and `DataLoader` as described in the Decision Outcome.

* Good, because loading, error and success states are handled consistently in the template with minimal conditions
* Good, because requests and responses are shared through the `DataSourcePool` without any further effort in the views
* Good, because the groundwork for polling, server-sent events, background reloading and retries lives in a single place rather than in each view
* Good, because the layers are separated and URIs are typed
* Bad, because it is a custom solution that new contributors need to learn
* Bad, because we are responsible for its maintenance and for any features we need in the future. But this also means that we own it, have full control and less dependencies.

## Implementation Details

For details around the implementation and examples of how and when to use `DataSource` and `DataLoader` please refer to [`@kumahq/data/vue/components`](https://github.com/kumahq/kuma-gui/blob/master/packages/data/src/vue/components/README.md).
