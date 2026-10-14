# @kumahq/config

Shared/common tooling and tooling config for `kumahq` packages/repos.

Includes tooling and config for (non-exhaustive)

- Make
- Cypress
- Playwright
- Typescript
- eslint
- renovate
- vite
- OpenAPI

Generally configs are made to be composable and designed to be used in multiple
repositories/monorepos. Generally packages will have some sort of
"entrypoint/main" file where `@kumahq/config` is imported and used.

> [!NOTE]
> Using `@kumahq/config` for shared configuration instead of top-level/root
> monorepo configuration is preferred in a similar way to preferring
> "composition over inheritance"

