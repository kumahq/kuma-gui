# Getting started

Welcome to the developer docs for the Kuma GUI application.

If you are considering to contribute and help create an awesome user experience, this documentation will help you get started. It serves as a guide and a reference for the technology, libraries, and things used to build and run the app.

## Prerequisites

You will need to have the following tools and programs installed to run and work on the application.

- [Node.js](https://nodejs.org) (see [.nvmrc](https://github.com/kumahq/kuma-gui/blob/master/.nvmrc) for the required main version)
- Yarn 1
- git

## Installing project dependencies

Install the project’s dependencies.

```sh
yarn install
```

## Starting the development server

Start a development server (runs on [localhost:8080](http://localhost:8080/) by default):

```sh
yarn run dev
```

The default development mode uses [msw](https://mswjs.io/) with custom mock data so you don’t have to run anything else to start exploring.

Alternatively, you can start the development server **without msw mocking the Kuma API**.

```sh
yarn run dev:real-api
```

::: tip
When running the GUI application using Kuma’s real API, you will need to run [Kuma](https://github.com/kumahq/kuma/) locally. Go to [github.com/kumahq/kuma](https://github.com/kumahq/kuma/) to find out how to do that.

By default, the application expects the Kuma API to be served from [localhost:5681](http://localhost:5681). This is configurable via the environment variable `VITE_KUMA_API_SERVER_URL`.

You can confirm Kuma is running by accessing its API:

```sh
curl http://localhost:5681/
```
:::

### Disabling anonymous reports in Kuma

If you are going to be creating a lot of policies, meshes, and data plane proxies in Kuma (e.g. for testing the GUI with realistic data), please make sure to disable Kuma’s anonymous reports in your profile:

```sh
echo "export KUMA_REPORTS_ENABLED=false" >> ~/.profile
```

## Build the application for production

```sh
yarn run build
```

::: tip NOTE
In production environments, the GUI application is typically served at [localhost:5681/gui/](http://localhost:5681/gui/).
:::

## Run unit tests

```sh
yarn test
```

## Run browser tests

Start a development server in one terminal window:

```sh
yarn run dev
```

Run the browser test UI in another terminal window:

```sh
yarn run test:browser:view
```

Or run the browser tests in CLI:

```sh
yarn run test:browser
```

::: tip
You can also run specific test files:

```sh
yarn run test:browser --spec features/zones/Index.feature
```
:::

## Run linters

Lint code using ESLint:

```sh
yarn run lint
```

Check types using vue-tsc:

```sh
yarn run lint:ts
```

Lint styles using Stylelint:

```sh
yarn run lint:styles
```

## File structure

- **dist**: holds the compiled Vue application (i.e. the output of `yarn run build`)
- **features**: holds the browser test files
- **public**: a handful of resources that are going to be copied as-is to the `dist` directory when building the application
- **src**: holds the application’s source code
  - **app**: all Vue.js single file component files. These files are organized roughly by their navigational hierarchy in the application. The sub directories of `src/app` can be thought of as modules. Module directories typically contain a `views` directory (for Vue components that are rendered by a route) and a `components` directory (for all other components used by the view components).
  - **assets**: fonts, images, SCSS/CSS files
  - **router**: everything relating to route management
  - **services**: application services
  - **store**: everything relating to state management
  - **types**: type definitions
  - **utilities**: plain utility functions

### CSS

For components, styles are preferably written using scoped style blocks inside the corresponding Vue single file component. We use SCSS.

For everything else (e.g. base styles, third-party overrides, utility styles, etc.), SCSS files can be created/updated in the [src/assets/styles](https://github.com/kumahq/kuma-gui/tree/master/src/assets/styles) directory.
