# Developer documentation

Welcome to the developer docs for the Kuma GUI! If you are considering contributing and helping create an awesome user
experience, this documentation will help you get started and up to speed. It serves as a guide and a reference for the
technology, libraries, and things used to build and run the app.

Consult the Table of Contents below to navigate these docs.

## Table of Contents

- [Developer documentation](#developer-documentation)
  - [Table of Contents](#table-of-contents)
  - [Dependencies](#dependencies)
    - [The Vue CLI tool](#the-vue-cli-tool)
  - [Libraries and tools](#libraries-and-tools)
  - [Folder structure](#folder-structure)
  - [Getting started](#getting-started)
    - [Setting up Kuma](#setting-up-kuma)
      - [Disable anonymous reports](#disable-anonymous-reports)
    - [Running the GUI](#running-the-gui)
    - [Building the GUI](#building-the-gui)
  - [Development](#development)
    - [Creating a new page view](#creating-a-new-page-view)
      - [1. Create your view component](#1-create-your-view-component)
      - [2. Create your REST functions](#2-create-your-rest-functions)
      - [3. Create your route](#3-create-your-route)
      - [4. Create your sidebar menu link](#4-create-your-sidebar-menu-link)
    - [Creating mock data](#creating-mock-data)
      - [Creating and modifying mocks](#creating-and-modifying-mocks)
    - [VueX store / State management](#vuex-store--state-management)
    - [Styles](#styles)
      - [Variables](#variables)
      - [Scoped SCSS](#scoped-scss)
      - [State](#state)
      - [Tailwind](#tailwind)
      - [Testing](#testing)

## Dependencies

- `git`
- `npm` or `yarn`
- `vue-cli-service`

### The Vue CLI tool

`vue-cli-service` is a binary that ships with `@vue/cli`. Once you have installed this globally, the binary
is exposed and available directly as `vue-cli-service`. If you would prefer to not install it, you can run the app with
`npx`, which comes bundled with `npm`:

```sh
npx vue-cli-service serve
```

## Libraries and tools

- [VueX](https://vuex.vuejs.org/) - For state management
- [Vue Router](https://router.vuejs.org/)
- [Kongponents](https://kongponents.netlify.app/) - An open source Vue component library created by [Kong](https://konghq.com/)
- [Axios](https://github.com/axios/axios) - For making promise-based API requests
- [msw](https://github.com/mswjs/msw) - For creating mock endpoint data (covered further down)

All styles are written as scoped SCSS inside of each component. For all utility and broader use CSS, styles can be written
in the appropriate place in `src/assets/styles`.

## Folder structure

The GUI is structured in standard Vue app format, with some unique differences.

- public - Contains our Vue app's index file and all static assets
- dist - This is where our build files output to
- tests
- src
  - assets - fonts, images, and all of our SCSS files
  - components - All of our Vue components and skeletons
    - Utils - Have a small component that serves a generic purpose? This is the ideal place for it
  - mixins
  - services - This is where our REST client and Kuma endpoints reside
  - store - Where all of our VueX modules and store are located
  - views - This is where the majority of our app resides. All route views are located here

## Getting started

### Setting up Kuma

_If you want to use only mocked data then you can skip following paragrpah. But if you want your gui to work on real data from your running Kuma then you can go to [Creating mock data](#creating-mock-data) and follow the steps to disable mock data._

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
and other views that the app serves. We will explain how to create new views.

### Creating a new page view

There are a few steps involved when creating a new view. It will need a route, a component, new REST functions, and a new
nav link in the sidebar.

#### 1. Create your view component

The easiest way to do this is to copy an existing view and rename it accordingly. For example, `CircuitBreakers.vue` would
be a good starting point. Once you've cloned an existing view and named it appropriately, below are the additional changes
to be made:

Change the component name and meta info:

```js
export default {
  name: 'MyNewView',
  metaInfo: {
    title: 'My New View',
  },
}
```

Update the endpoints in the `getTableData` function located in the `loadData()` method:

```js
const { data, next } = await getTableData({
  getSingleEntity: Kuma.getCircuitBreaker.bind(Kuma),
  getAllEntities: Kuma.getAllCircuitBreakers.bind(Kuma),
  getAllEntitiesFromMesh: Kuma.getAllCircuitBreakersFromMesh.bind(Kuma),
  mesh,
  query,
  size: this.pageSize,
  offset,
})
```

Here is a quick breakdown of what each of these requests does:

- `getAllCircuitBreakers()` - Fetches all Circuit Breakers for all meshes
- `getCircuitBreaker()` - Gets a specific Circuit Breaker from a mesh
- `getAllCircuitBreakersFromMesh()` - Gets all Circuit Breakers for a specific mesh

#### 2. Create your REST functions

All REST functions used throughout the app are located in `src/services/kuma.ts`. To use it you need to import our `Kuma` service:

```js
import Kuma from '@/services/kuma'
```

We won't go into detail about how to create each API function, since this documentation makes the assumption that the reader
has an understanding of Vue concepts. Each existing function is pretty self-explanatory and named in a way that helps describe
what it's doing.

#### 3. Create your route

All Mesh-related view routes are located under the route named `mesh`. Inside of `children: []`
within the `mesh` route, add something like this:

```js
{
  path: 'my-new-view',
  name: 'my-new-view',
  meta: {
    title: 'My New View',
    breadcrumb: 'My New View'
  },
  component: () => import(/* webpackChunkName: "my-new-view" */ '@/views/Entities/MyNewView')
},
```

Your route will look like this: `http://localhost:8080/#/mesh/:mesh/my-new-view`. `:mesh` is a route `param` that is
replaced with the mesh that the user has selected in the app (this defaults to `all`, which shows data for all Meshes).

#### 4. Create your sidebar menu link

All of the sidebar menu items are located in `src/components/Sidebar/menu.ts`. If you are creating a view for a new Service,
place your link inside of `items` within `subNav`:

```js
subNav: {
  items: [
    {
      name: 'My New View',
      link: 'my-new-view', // this is the `name` of your route
    },
  ]
}
```

If you are instead creating a new title to divide your nav items, you can do this:

```js
{
  name: 'My Group Name',
  title: true
}
```

### Creating mock data

For handling mock data, we use [msw](https://github.com/mswjs/msw).

**NOTE: Mocking is enabled by default.** If you need to disable this in order to see only data coming from Kuma itself:

1. Stop the app with `ctrl+c`
2. change `VUE_APP_MOCK_API_ENABLED` to `false` in `.env.development`
3. Restart the app

#### Creating and modifying mocks

All of declaration of files which contain mock data are located in `src/services/mocks.ts`. We recommend reading the
[documentation](https://mswjs.io/docs/getting-started/mocks) for msw to get an understanding
on how it works and what it has to offer.

### VueX store / State management

All of our app state management functionality is located in `src/store/index.ts`.
We recommend to ONLY add and handle things related to overall aplication into the store.
If something is only needed at level of Policy/Resource then please leave it there, instead of putting that data into store.

### Styles

Right now we use [tailwind](https://v1.tailwindcss.com/) for most of our css. There is also a lot of CSS which was done using [BEMCSS](http://getbem.com/introduction/) methodology.
Overall if its possible then try to cover all css with tailwind. If not - then please follow BEM rules, but since we are
writing mostly scoped styles on all of our Vue components, our naming conventions can be more relaxed. Please make sure
to name your elements in a clear manner.

#### Variables

When working with [Kongponents](https://kongponents.netlify.app/), you'll see that
[CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) are used heavily. This
allows styles in components to be overridden with ease.
[Here is an example](https://kongponents.netlify.app/components/button.html#theming) of how button variables can be
overridden without having to do hacky `!important` or `.class-name.class-name` hacks:

```js
<template>
  <KButton
    class="purple-button"
    appearance="primary"
    @click="someCoolEvent"
  >
    PURPLE!
  </KButton>
</template>

<style>
.purple-button {
  --KButtonPrimaryBase: #494ca2;
  --KButtonPrimaryHover: #6c6ebd;
  --KButtonPrimaryActive: #3c3f86;
}
</style>
```

The same applies to our GUI app. All of our global and component-specific CSS variables are stored within
`src/assets/styles/variables.scss`. You'll notice that there are some SCSS variables present as well. This is so we can
leverage some of the built-in color modification functions that Sass offers.

#### Scoped SCSS

When writing styles inside of a component, make sure to include `scoped` to prevent style collisions:

```js
<style lang="scss" scoped>
.your-component {
  color: rebeccapurple;

  // try not to go more than 3 elements deep when nesting
  .nested-item {
    display: block;
  }
}
</style>
```

If you are writing broader styles in a CSS/SCSS file, make sure to leverage BEM. This helps keep things clear and concise:

```css
.main-sidebar {
}
.main-sidebar__nav-link {
}
.main-sidebar__nav-link--is-active {
}
.main-sidebar__title {
}
```

#### State

When handling states in CSS, we like to use human-readable classes to make it obvious that a certain state is applied or
active. This helps when scanning through the codebase, and helps with debugging as well. Here are some examples:

```css
.is-expanded {
}
.is-active {
}
.is-fixed {
}
```

#### Tailwind

In an effort to help with rapid development and avoid reinventing the wheel, we use some [Tailwind](https://tailwindcss.com/)
utilities throughout the app. If you need to revise or view the configuration for Tailwind, this is handled in the
`tailwind.config.js` file.

All of our needed Tailwind components are included with the `src/assets/styles/third-party/tailwind.css` file:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### Testing

For tests we use [vue-testing-library](https://github.com/testing-library/vue-testing-library).
Overall we should place our tests next to the file which we are testing.
For example if you have file in `./src/components/HelloWorld.vue` you should create test file in `./src/components/HelloWorld.spec.ts`.
You can find some examples how we should structure our tests in `./tests/examples/*`.
