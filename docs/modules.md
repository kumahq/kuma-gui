# Modules

In `src/app/$module/`.

A big part of the project’s business logic is loosely grouped into modules. For example, there is a zones module in `src/app/zones/`, a services module in `src/app/services/`, etc. A module consists of components and scripts for utility functions, route definitions, etc.

## Components

In `src/app/$module/components/` or `src/app/$module/views/`.

A module’s components are placed in either a `components` or a `views` directory. Views are components that are hooked up to route definitions and are placed in the `views` directory. Any other component is placed in the `components` directory.

::: tip NOTE
Components that aren’t module-specific (or shared by multiple modules) are placed in `src/app/common/` instead.
:::

## Locales

In `src/app/$module/locales/$locale/`.

::: tip
Learn more about [i18n](/src/app/application/services/i18n/README.md)
:::

A module typically has message files which contain the visible/human-readable UI text in the form of a YAML object. Each piece of text is associated to a key in the form of a path that represents the location of the message in the YAML object.

## Utilities

In `src/app/$module/utilities/`.

Holds module-specific utility functions.

## Features

::: tip
Learn more about [can](/src/app/application/services/can/README.md)
:::

In `src/app/$module/features.ts`.

Holds a module’s feature definitions. Features are used to lock down or expose parts of the application based on some runtime state using the [can](/src/app/application/services/can/README.md) utility. Features are _defined_ in a module but can be used outside of modules.

## Routes

In `src/app/$module/routes.ts`.

::: tip
Learn more about [routing](/docs/routing.md)
:::

Holds a module’s route definitions. They’re used to set-up the application routes.

## Sources

In `src/app/$module/sources.ts`.

::: tip
Learn more about [DataSource](/src/app/application/services/data-source/README.md)
:::

Holds a module’s data source definitions. They’re used to provide read access to data (most commonly via our HTTP API).

## Service definition

In `src/app/$module/index.ts`.

::: tip
Learn more about [services](/src/services/README.md)
:::

Defines the module so it can be exposed to our dependency injection layer. This makes it so that a module’s features and sources are available throughout the application.
