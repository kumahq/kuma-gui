---
section: Overview
---
# Modules

Our modules/packages are currently in `src/app/$module/`, but will eventually
be moved to fully fledged npm modules via workspaces.

The application is grouped into separate modules/packages, mostly by "Kuma
Noun". For example, there is a zones module in `src/app/zones/`, a services
module in `src/app/services/`, etc.

There are other more generic/framework modules such as `application`, `msw`,
`me`, `x` etc.

A module consists of several things such as:

- `index`: service container configuration
- `routes`: Vue routing configuration
- `sources`: definitions for URIs/DataSources i.e. data retrieval
- `features`: user 'abilities' definitions, i.e. feature flags
- `components/`: components specific to this package
- `views/`: views/pages/routes specific to this package
- `data/`: data manipulation/correction/reshaping
- `locales/` i18n strings

## Components

The application has two distinct types of "component". "View", "Route" or
"Page" components and re-usable components.

Route components are assigned to each specific route within `route.ts`. These
components currently live in a flat structure in `src/app/$module/views/`.

Other re-usable components live in `src/app/$module/components/`

## Locales

In `src/app/$module/locales/$locale/`.

::: tip
Learn more about [i18n](/src/app/application/services/i18n/README.md)
:::

A module typically has message files which contain the visible/human-readable
UI text in the form of a YAML object. Each piece of text is associated to a key
in the form of a path that represents the location of the message in the YAML
object.

## Features

::: tip
Learn more about [can](/src/app/application/services/can/README.md)
:::

In `src/app/$module/features.ts`.

Holds a module’s feature definitions. Features are used to lock down or expose
parts of the application based on some runtime state using the
[can](/src/app/application/services/can/README.md) utility. Features are
_defined_ in a module but can be used outside of modules.

## Routes

In `src/app/$module/routes.ts`.

::: tip
Learn more about [routing](/docs/routing.md)
:::

Holds a module’s route definitions. They’re used to set-up the application
routes.

## Sources

In `src/app/$module/sources.ts`.

::: tip
Learn more about [DataSource](/src/app/application/services/data-source/README.md)
:::

Holds a module’s data source definitions. They’re used to provide read access
to data (most commonly via our HTTP API).

## Data

In `src/app/$module/data/`

## Service definition

In `src/app/$module/index.ts`.

::: tip
Learn more about [services](/src/services/README.md)
:::

Defines the module so it can be exposed to our dependency injection layer. This
makes it so that a module’s features and sources are available throughout the
application in a way that can be configured, grouped, decorated and overridden
from The Outside i.e. without altering the code of the application itself.

