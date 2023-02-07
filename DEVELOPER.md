# Kuma GUI

Welcome to the developer docs for the Kuma GUI application.

If you are considering to contribute and help create an awesome user experience, this documentation will help you get started. It serves as a guide and a reference for the technology, libraries, and things used to build and run the app.

## Table of contents

- [Prerequisites](#prerequisites)
  - [Global dependencies](#global-dependencies)
  - [Installing project dependencies](#installing-project-dependencies)
- [Development](#development)
  - [Starting the development server](#starting-the-development-server)
    - [Disabling anonymous reports in Kuma](#disabling-anonymous-reports-in-kuma)
  - [Build the application for production](#build-the-application-for-production)
  - [Run unit tests](#run-unit-tests)
  - [Run linters](#run-linters)
  - [Releasing new versions of Kuma](#releasing-new-versions-of-kuma)
- [Project structure & organization](#project-structure--organization)
  - [Libraries and tools](#libraries-and-tools)
  - [Directory structure](#directory-structure)
  - [CSS](#css)

## Prerequisites

### Global dependencies

You will need to have the following tools and programs installed to run and work on the application.

- Node.js (see [.nvmrc](https://github.com/kumahq/kuma-gui/blob/master/.nvmrc) for the required main version)
- Yarn (npm won’t work)
- git

### Installing project dependencies

Run `yarn install` to install the project’s dependencies.

```sh
yarn install
```

## Development

### Starting the development server

To start a development server (by default as [localhost:8080](http://localhost:8080/)), run:

```sh
yarn run dev
```

The default development mode uses [msw](https://mswjs.io/) with custom mock data so you don’t have to run anything else to start exploring.

Alternatively, you can start the development server **without msw mocking the Kuma API**.

```sh
yarn run dev:real-api
```

When running the GUI application using Kuma’s real API, you will need to run [Kuma](https://github.com/kumahq/kuma/) locally. Go to [github.com/kumahq/kuma](https://github.com/kumahq/kuma/) to find out how to do that.

By default, the application expects the Kuma API to be served from [localhost:5681](http://localhost:5681). This is configurable via the environment variable `VITE_KUMA_API_SERVER_URL`.

You can confirm Kuma is running by accessing its API:

```sh
curl http://localhost:5681/
```

#### Disabling anonymous reports in Kuma

If you are going to be creating a lot of policies, meshes, and data plane proxies in Kuma (e.g. for testing the GUI with realistic data), please make sure to disable Kuma’s anonymous reports in your profile:

```sh
echo "export KUMA_REPORTS_ENABLED=false" >> ~/.profile
```

### Build the application for production

Note that in production environments, the GUI application is typically served at [localhost:5681/gui/](http://localhost:5681/gui/).

```sh
yarn run build
```

### Run unit tests

```sh
yarn test
```

### Run linters

```sh
yarn run lint
```

### Releasing new versions of Kuma

When a new version of Kuma is being prepared for release, a stabilization phase takes place during which a release branch is prepared (e.g. [`kumahq/kuma@release-2.1`](https://github.com/kumahq/kuma/tree/release-2.1) for the release(s) of Kuma on version 2.1). This release branch will include changes for version 2.1.0 but also possibly for patch releases for that minor version (e.g. 2.1.1, 2.1.2, but not 2.2.0 or 2.2.1, etc.).

**During this time, relevant changes in Kuma GUI *SHOULD* be merged into a release branch of the same name instead of the default branch.** Relevant changes are those who should be released alongside the new version of Kuma. Other changes *may* be merged into the project’s default branch.

Once the new version of Kuma was released, changes from the release branch are to be merged back into the project’s default branch.

#### Example 1: new minor versions

For example, during the stabilization phase for the release of Kuma 2.1, a new `release-2.1` branch is created at (roughly) the same time the `release-2.1` branch is created in Kuma. New pull requests are opened against this branch.

#### Example 2: new patch versions

For example, during the stabilization phase for the release of Kuma 2.1.1, new pull requests are opened against the `release-2.1` branch. In this scenario, the `release-2.1` branch already exists.

## Project structure & organization

### Libraries and tools

Kuma GUI is a single page application written in Vue.js 3 and TypeScript. We try following the [Vue.js Style Guide](https://vuejs.org/style-guide/) where possible and feasible.

- [vuex](https://vuex.vuejs.org/): client-side state management
- [vue-router](https://router.vuejs.org/)
- [@kong/kongponents](https://kongponents.netlify.app/): an open source Vue.js component library created by [Kong](https://konghq.com/)
- [msw](https://mswjs.io/): for creating mock data for the API

### Directory structure

- **dist**: holds the compiled Vue application (i.e. the output of `yarn run build`)
- **public**: a handful of resources that are going to be copied as-is to the `dist` directory when building the application
- **src**: holds all source code
  - **app**: all Vue.js single file component files. These files are organized roughly by their navigational hierarchy in the application. The sub directories of `src/app` can be thought of as modules. Module directories typically contain a `views` directory (for Vue components which represent full pages, i.e. components you hook up using vue-router) and a `components` directory (for all other components used by the views).
  - **assets**: fonts, images, SCSS/CSS files
  - **router**: everything relating to route management
  - **services**: everything relating to API management
  - **store**: everything relating to state management
  - **test-data**: test data factory functions for use in unit tests
  - **utils**: plain utility functions

### CSS

For components, styles are preferably written using scoped style blocks inside the corresponding Vue single file component. We use SCSS.

For everything else (e.g. base styles, third-party overrides, utility styles, etc.), SCSS files can be created/updated in the [src/assets/styles](https://github.com/kumahq/kuma-gui/tree/master/src/assets/styles) directory.
