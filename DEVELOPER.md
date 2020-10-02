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
    title: 'My New View'
  }
}
```

Update the endpoints in the `endpoint` const located in the `loadData()` method:

```js
const mesh = this.$route.params.mesh || null
const query = this.$route.query.ns || null

const params = {
  size: this.pageSize,
  offset: this.pageOffset
}

const endpoint = () => {
  if (mesh === 'all') {
    return this.$api.getAllCircuitBreakers(params)
  } else if ((query && query.length) && mesh !== 'all') {
    return this.$api.getCircuitBreaker(mesh, query, params)
  }

  return this.$api.getAllCircuitBreakersFromMesh(mesh)
}
```

Here is a quick breakdown of what each of these requests does:

* `getAllCircuitBreakers()` - Fetches all Circuit Breakers for all meshes
* `getCircuitBreaker()` - Gets a specific Circuit Breaker from a mesh
* `getAllCircuitBreakersFromMesh()` - Gets all Circuit Breakers for a specific mesh

#### 2. Create your REST functions

All REST functions used throughout the app are located in `src/services/kuma.js`. To make the API accessible globally,
we've defined it as an instance property inside of our `main.js` file, which will import our Kuma service:

```js
const kuma = new Kuma()

Vue.prototype.$api = kuma
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
Your route will look like this: `http://localhost:8080/#/:mesh/my-new-view`. `:mesh` is a route `param` that is
replaced with the mesh that the user has selected in the app (this defaults to `all`, which shows data for all Meshes).

#### 4. Create your sidebar menu link

All of the sidebar menu items are located in `src/components/Sidebar/menu.js`. If you are creating a view for a new Service,
place your link inside of `items` within `subNav`:

```js
subNav: {
  items: [
    {
      name: 'My New View',
      link: 'my-new-view' // this is the `name` of your route
    }
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

If you have a route that requires the `:mesh` to be inserted at the end of the URL instead of before your route's path,
you can use the `pathFlip` boolean to enable this:

```js
{
  name: 'Meshes',
  link: 'mesh-child',
  pathFlip: true
}
```

**What does `pathFlip` do?**

By default, the format for URLs is `/default/meshes`. `default` being the selected Mesh name, and `circuit-breakers`
being the path for our route. But say you wanted the Mesh to be at the end instead (like in the context of the Meshes
view). Your route would instead be structured like so: `/meshes/default`
