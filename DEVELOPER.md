# Developer documentation

Welcome to the developer docs for the Kuma GUI! If you are considering contributing and helping create an awesome user
experience, this documentation will help you get started and up to speed. It serves as a guide and a reference for the
technology, libraries, and things used to build and run the app.

Consult the Table of Contents below to navigate these docs.

## Table of Contents

## Dependencies

* `git`
* `npm` or `yarn`
* `vue-cli-service`

### The Vue CLI tool

`vue-cli-service` is a binary that ships with `@vue/cli-service`. Once you have installed this globally, the binary
is exposed and available directly as `vue-cli-service`. If you would prefer to not install it, you can run the app with
`npx`, which comes bundled with `npm`:

```sh
npx vue-cli-service serve
```

## Libraries and tools

* [VueX](https://vuex.vuejs.org/) - For state management
* [Vue Router](https://router.vuejs.org/)
* [Kongponents](https://kongponents.netlify.app/) - An open source Vue component library created by [Kong](https://konghq.com/)
* [Axios](https://github.com/axios/axios) - For making promise-based API requests
* [axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter) - For creating mock endpoint data (covered further down)

All styles are written as scoped SCSS inside of each component. For all utility and broader use CSS, styles can be written
in the appropriate place in `src/assets/styles`.

## Getting started

### Setting up Kuma

First and foremost, this app depends on [Kuma](https://github.com/kumahq/kuma/) being installed locally and running.
The app will actively look for the API Kuma exposes and it will not run without it. Once the app finds the API endpoint
for fetching data from Kuma, it will store some information in the browser via localStorage so that it can persistently
access it (for things like Kuma's status, version, environment, etc).
The [Kuma installation page](https://kuma.io/install/latest/) will help you get started.

Once you have Kuma running, its API is accessible at `http://localhost:5681/`. If you would like to test it, Meshes
can be found at `http://localhost:5681/meshes`. Kuma creates a `default` Mesh out-of-box.

In production, the GUI is served from `http://localhost:5681/gui/`. In both production and development modes, its API and
config endpoint URLs are derived from the env variable `VUE_APP_KUMA_CONFIG` -- which is found in both `.env.production`
and `.env.development`.

#### Disable anonymous reports

If you are going to be creating a lot of policies, meshes and dataplanes in Kuma to test with the GUI in development mode,
please make sure to disable Kuma's anonymous reports in your profile:

```sh
echo "export KUMA_REPORTS_ENABLED=false" >> ~/.profile
```

### Running the GUI

Now that you've got Kuma itself setup and running, it's time to get the GUI running in development mode from this repository:

```
yarn serve
```

You can now access the GUI at `http://localhost:8080` 🎉 🚀

### Building the GUI

To build the GUI for production, use the following command:

```sh
yarn build
```

This will output the build files to `/dist/`.

## Development

The GUI is built on [Vue 2](https://vuejs.org/v2/guide/).

A lot of the small components you will see in the GUI are from the open source Vue.js component library
[Kongponents](https://kongponents.netlify.app/). If you are looking for a specific type of component to achieve something,
we recommend looking there first to save time. This also helps keep styles and design consistent.

For larger components, we've created "skeletons" that are composed of multiple smaller components and accept an array of
props for data handling and other functionality. You can see some examples in `src/components/Skeletons`. This keeps things
DRY and more flexible.

The most prominent Skeleton in use is the `DataOverview`. It's used to serve each of the Policies, Meshes, Dataplanes,
and other views that the app serves.

### Creating a new view

There are a few steps involved when creating a new view
