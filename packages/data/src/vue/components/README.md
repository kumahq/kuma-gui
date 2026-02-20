---
type: component
---
# DataSource

`DataSource` is used for loading/reading data in the application. Used on its
own it is **non-blocking**. `DataLoader` is a blocking data loader that uses
`DataSource` under the hood, or can be used in conjunction with `DataSource` to
create more detailed blocking/non-blocking loading use cases.

The simplest example is:

```vue
<DataSource
  src="/mesh-insights"
  v-slot="{ data }"
>
  {{ data?.items.length }}
</DataSource>
```

The `src` is a string based [Uniform Resource
Identifier](https://developer.mozilla.org/en-US/docs/Glossary/URI) that refers
to a piece of data a.k.a. a resource.

::: warning
All resources/sources for our application are defined in a module's
corresponding `@/app/module-name/sources.ts` file. Also see [Creating new
URIs/sources](#creating-new-uris-sources)
:::

For improved typing for `DataSource` you can our `uri` helper to define URIs. Our
`uri` helper is exported from `RouteView`

```vue
<RouteView
  v-slot="{ uri }"
>
  <DataSource
    :src="uri(sources, '/mesh-insights')"
    v-slot="{ data }"
  >
    {{ data?.items.length }}
  </DataSource>
</RouteView>
<script lang="ts" setup>
import { sources } from "@/app/meshes/sources";
</script>
```

Whilst you can just use strings for `uri`s, using `uri` helper exported by
`RouteView` will give you correct types for the resource

```vue
<RouteView
  name="the-name-of-the-route"
  :params="{
    policyName: '',
    page: 1,
  }"
  v-slot="{ route, uri }"
>
  <AppView>
    <DataSource
      :src="uri(sources, '/mesh-insights')"
      v-slot="{ data }"
    >
        {{ data?.items.length }}
    </DataSource>
  </AppView>
</RouteView>
<script lang="ts" setup>
import { sources } from "@/app/meshes/sources";
</script>
```

### Simple DataLoader usage

Whilst DataSources fetch data for you they do not deal with loading and error
states specifically. For that you will need to use DataLoader. You can see that
DataLoader will probably be the component you will use the most, but if you
need to do more complex data fetching you will likely use a combination of
both.

The following shows the most common use case, just block until the data is loaded.
Note: as the default slot is being used here `data` is guaranteed to be set,
therefore `?`/`data?` is not needed.

```vue
<RouteView
  name="the-name-of-the-route"
  :params="{
    policyName: '',
    page: 1,
  }"
  v-slot="{ route, uri }"
>
  <AppView>
    <DataLoader
      :src="uri(sources, '/mesh-insights')"
      v-slot="{ data }"
    >
      We won't see this until the data is completely loaded
      {{ data.items.length }}
    </DataLoader>
  </AppView>
</RouteView>
<script lang="ts" setup>
import { sources } from "@/app/meshes/sources";
</script>
```

### Loading multiple sources

To load multiple sources use a mix of `DataSource` and `DataLoader`, but be
sure to pass through both `data` and `error`. You can do this more succinctly
and ergonomically using `result` which is a `T | Error | undefined` and
designed to be similar to Zig and Golang's error handling (for example `!Data`
and `[data, nil]` respectively) which, like Vue templates, don't feature
try/catch semantics.

::: warning
Usually, you should only use `result` in order to easily pass DataSource
information around between, or through, components using only a single
prop/variable. It is a union and therefore requires more checks than those
required to access `data` or `error` which use a non-union type.
:::


```vue
<DataSource
  :src="uri(sources, '/mesh-insights')"
  v-slot="{ result: meshesResult }"
>
  <DataSource
    :src="uri(sources, '/zones')"
    v-slot="{ result: zonesResult }"
  >
    <DataLoader
      :data="[meshesResult, zonesResult]"
      v-slot="{ data: [meshes, zones] }"
    >
      We won't see this until the data is completely loaded
      {{ data.items.length }}
    </DataLoader>
  </DataSource>
</DataSource>

<!-- more explicit, but more word-y and less ergonomic  -->
<DataSource
  :src="uri(sources, '/mesh-insights')"
  v-slot="{ data: meshes, error: meshError }"
>
  <DataSource
    :src="uri(sources, '/zones')"
    v-slot="{ data: zones, error: zoneError }"
  >
    <DataLoader
      :data="[
        meshes,
        zones
      ]"
      :errors="[
        meshError,
        zoneError
      ]"
      v-slot="{ data: [meshes, zones] }"
    >
      We won't see this until both meshes and zones are completely loaded.
      {{ meshes.items.length }}
    </DataLoader>
  </DataSource>
</DataSource>
```

This approach gives you a very easy way to achieve the basics but also the
flexibility to decompose things down when you need more complex functionality
or access to lower level information.

## Creating new URIs/sources

Most modules contain a file called `sources.ts` to define how the application
fetches it's resources for a URI:

```ts
export const sources = (api) => {
  return defineSources({
    "/meshes/:name": async (params) => {
      const { name } = params;
      // i.e. Promise.resolve({ name: 'default', creationTime: '0000-00-00 00:00:00'})
      // or an API/HTTP call
      return api.getMesh({ name });
    },
  });
};
```

They are a simple "String to Promise" map. i.e. "use this string as your URI get
the result of this Promise".

```vue
<DataLoader
  :src="`/mesh/${'default'}`"
  v-slot="{ data }"
>
  Name: {{ data.name }} <== "default"
  Creation Time: {{ data.creationTime }}
</DataLoader>
```

`sources` also support generators for more complex requests/use-cases such as
polling.

```ts
'/meshes/:name/polling': async function* (params, { signal }) {
  const { name } = params
  while (!signal.aborted) {
    yield api.getMesh({ name });
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
},

