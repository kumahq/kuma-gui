# DataSource

`DataSource` is used for loading/reading data in the application. Used on its
own it is **non-blocking**. `DataLoader` is a blocking data loader that uses
`DataSource` under the hood, or can be used in conjunction with `DataSource` to
create more detailed blocking/non-blocking loading use cases.

The simplest example is:

```vue
<DataSource
  v-slot="{ data }"
  src="/mesh-insights"
>
  {{ data?.items.length }}
</DataSource>
```

The `src` is a string based [Uniform Resource
Identifier](https://developer.mozilla.org/en-US/docs/Glossary/URI) that refers
to a piece of data a.k.a. a resource.


::: warning
All resources/sources for our application are defined in a modules
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
      v-slot="{ data }"
      :src="uri(sources, '/mesh-insights')"
    >
      {{ data?.items.length }}
    </DataSource>
</RouteView>
<script lang="ts" setup>
import { sources} from '@/app/meshes/sources'
</script>
```

Whilst you can just use strings for `uri`s, using `uri` helper exported by
`RouteView` will give you correct typing:

```vue
<RouteView
  v-slot="{ route, uri }"
  name="the-name-of-the-route"
  :params="{
    policyName: '',
    page: 1
  }"
>
  <AppView>
    <DataSource
      v-slot="{ data }"
      :src="uri(sources, '/mesh-insights')"
    >
        {{ data?.items.length }}
    </DataSource>
  </AppView>
</RouteView>
<script lang="ts" setup>
import { sources} from '@/app/meshes/sources'
</script>
```

### Simple DataLoader usage

The following is the most common use case, just block until the data is loaded.

```vue
<RouteView
  v-slot="{ route, uri }"
  name="the-name-of-the-route"
  :params="{
    policyName: '',
    page: 1
  }"
>
  <AppView>
    <DataLoader
      v-slot="{ data }"
      :src="uri(sources, '/mesh-insights')"
    >
        We won't see this until the data is completely loaded
        {{ data?.items.length }}
    </DataLoader>
  </AppView>
</RouteView>
<script lang="ts" setup>
import { sources} from '@/app/meshes/sources'
</script>
```

### Loading multiple sources

To load multiple sources use a mix of `DataSource` and `DataLoader`. Be sure to
pass through both `data` and `error`:

```vue
<DataSource
  v-slot="{ data: meshes, error: meshError }"
  :src="uri(sources, '/mesh-insights')"
>
  <DataSource
    v-slot="{ data: zones, error: zoneError }"
    :src="uri(sources, '/zones')"
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
    >
      We won't see this until the data is completely loaded
      {{ data?.items.length }}
    </DataLoader>
  </DataSource>
</DataSource>
```

## Creating new URIs/sources

Most modules contain a file called `sources.ts` to define how the application
fetches it's resources for a URI:

```ts
export const sources = (api) => {
  return defineSources({
    '/meshes/:name': async (params) => {
      const { name } = params
      // i.e. Promise.resolve({ name: 'default', creationTime: '0000-00-00 00:00:00'})
      // or an API/HTTP call
      return api.getMesh({ name })
    },
  })
}
```

They are a simple "String to Promise" map. i.e. "use this string as your URI get
the result of this Promise".

```vue
<DataSource
  v-slot="{ data }"
  :src="`/mesh/${'default'}`"
>
  Name: {{ data?.name }} <== "default"
  Creation Time: {{ data?.creationTime }}
</DataSource>
```



