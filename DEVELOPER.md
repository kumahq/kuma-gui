# Getting started

Welcome to the developer docs for the Kuma GUI application.

If you are considering to contribute and help create an awesome user experience, this documentation will help you get started. It serves as a guide and a reference for the technology, libraries, and things used to build and run the app.

## Prerequisites

You will need to have the following tools and programs installed to run and work on the application.

- [Node.js](https://nodejs.org)  and `npm` (see [.nvmrc](https://github.com/kumahq/kuma-gui/blob/master/.nvmrc) for the required main version)
- git
- make

## Installing project dependencies

Install the project’s dependencies.

```sh
make install
```

## Starting the development server

Start a development server (runs on [localhost:8080](http://localhost:8080/) by default):

```sh
make run
```

The default development mode uses [msw](https://mswjs.io/) with custom mock data so you don’t have to run anything else to start exploring.

Alternatively, make the development mode use a real Kuma installation running at <http://localhost:5681>.

::: tip
To work on GUI features using Kuma’s real API, you will need to run [Kuma](https://github.com/kumahq/kuma/) locally. Go to [github.com/kumahq/kuma](https://github.com/kumahq/kuma/) to find out how to do that.

You can confirm Kuma is running by accessing its API:

```sh
curl http://localhost:5681/
```
:::

Once installed you can make the development server/GUI use Kuma by adding a `KUMA_MOCK_API_ENABLED=false` cookie to your browser. You can do this my using the browser's Application/Cookies settings in Web Inspector, or by clicking <http://localhost:8080/gui/#KUMA_MOCK_API_ENABLED=false> (and set it back again by clicking http://localhost:8080/gui/#KUMA_MOCK_API_ENABLED=true)


### Disabling anonymous reports in Kuma

If you are going to be creating a lot of policies, meshes, and data plane proxies in Kuma (e.g. for testing the GUI with realistic data), please make sure to disable Kuma’s anonymous reports in your profile:

```sh
echo "export KUMA_REPORTS_ENABLED=false" >> ~/.profile
```

## Build the application for production

```sh
make build
```

::: tip NOTE
In production environments, the GUI application is typically served at [localhost:5681/gui/](http://localhost:5681/gui/).
:::

## Run unit tests

```sh
make test/unit
```

## Run browser tests

Start a development server in one terminal window:

```sh
make run
```

Run the browser test UI in another terminal window:

```sh
make test/e2e
```
::: tip NOTE
By default when running the e2e tests locally the tests will always run against <http://localhost:8080/gui/>
:::

::: tip
You can also run specific test files:

```sh
npm run test:browser --spec features/zones/Index.feature
```
See our (package file)[https://github.com/kumahq/kuma-gui/blob/master/package.json] for more details
:::

## Run linters

```sh
make lint
```

::: tip
You can also lint specific language files:

```sh
npm run lint:ts
```
See our (package file)[https://github.com/kumahq/kuma-gui/blob/master/package.json] for more details
:::


## File structure

- **dist**: holds the compiled Vue application (i.e. the output of `make build`)
- **features**: holds the browser test files
- **public**: a handful of resources that are going to be copied as-is to the `dist` directory when building the application
- **src**: holds the application’s source code
  - **app**: all Vue.js single file component files. These files are organized roughly by their navigational hierarchy in the application. The sub directories of `src/app` can be thought of as modules. Module directories typically contain a `views` directory (for Vue components that are rendered by a route) and a `components` directory (for all other components used by the view components).
  - **assets**: fonts, images, SCSS/CSS files
  - **types**: type definitions

### CSS

For components, styles are preferably written using scoped style blocks inside the corresponding Vue single file component. We use SCSS.

For everything else (e.g. base styles, third-party overrides, utility styles, etc.), SCSS files can be created/updated in the [src/assets/styles](https://github.com/kumahq/kuma-gui/tree/master/src/assets/styles) directory.
