---
type: component
---
# RouteView

Our `RouteView` component should be used as the top-most component for **every
routable `*View.vue` component**. Think of it as your `<html>` tag.

::: danger
When using this you should specify the name of the route you are creating as
the RouteView's `name` property.
:::

`RouteView` contains functionality to:

- make it easy to set top-level DOM values that you usually wouldn't have
  direct access to, for example [setting the HTML `<title>`](#setting-the-title-of-the-page) or [the HTML `class` attribute](#setting-html-node-attributes).
- [provide access to utilities/tooling commonly used in route views](#exposing-commonly-used-utilities) i.e.
  `route`, `t` and `uri`

## Setting the `<title>` of the page

`RouteView` works in tandem with `RouteTitle` allowing you to set the HTML title for
the page from anywhere in your `*View.vue` component.

```vue
<RouteView name="route-name">
  <h1>
    <RouteTitle
      title="The title"
    />
  </h1>
...
</RouteView>
```

`RouteTitle` also renders the title you give it into the page, meaning that you
can easily use the same text for your page header and the HTML title.

Titles are automatically joined together as you would expect in a nested route
structure and finally suffixed by the title of the product (taken from our i18n
strings). The above code, depending on nested routes could end up like:

```vue
<html>
  <head>
    <title>The title | Parent title | Kuma Manager</title>
  </head>
  ...
</html>
```

Additionally `RouteTitle` adds additional HTML markup at the root of the
application to announce the HTML title to a11y screenreaders.

## Setting HTML node attributes

::: warning
Currently we only support setting the `className`. If you need to add further
attributes such as `data-*`, you'll need to add that functionality to
`RouteView` then please submit a PR.
:::

```vue
<RouteView
  name="route-name"
  :attrs="{
    class: 'my-html-class',
  }"
>
...
</RouteView>
```

Using the `attrs` attribute in the above code will result in the following
HTML:

```html
<html class="my-html-class">
  ...
</html>
```

The logic is careful not to remove/change any statically added attributes that
existed on the node previously, and any attributes you add will be automatically
removed when the `*View.vue` route/view component is removed from the page/DOM.

## Exposing commonly used utilities

`RouteView` exposes a selection of commonly used utilities from its default slot.

```vue
<RouteView
  v-slot="{ route, t, env, uri, can }"
  name="route-name"
  ...
>
```

- `t`: The usual i18n `t` function i.e. `t('a.i18n.key')`
- `env`: Access string based environment variables i.e. `env('KUMA_API_URL')`
- `can`: Make decisions based on a users abilities/enabled featureset i.e. `can('use meshservice')`
- `uri`: Helper for creating type-safe URI strings specifically for use with [DataSource](/src/app/application/components/data-source/README)
- `route`: Access several route utilities `route.params`, `route,children`, `route.update()` etc.

::: warning
`route` is not an instance of `vue-router`'s `route`. It is very similar but
removes access to some things and dds functionality to others.
:::

```vue
<RouteView
  name="route-name"
  v-slot="{ route }"
  :params="{
    service: '',
    page: 1,
  }"
>
  <h1>
    <RouteTitle
      :title="route.params.service"
    />
    Page: {{ route.params.page }}
  </h1>
...
</RouteView>
```

## Props

| Name   | Description                                                                                             |
| ------ | ------------------------------------------------------------------------------------------------------- |
| `name` | The name of the current route file as specified in your routing configuration i.e. `services-list-view` |

## Slots

### default

#### exports

| Name    | Description                                                                 |
| ------- | --------------------------------------------------------------------------- |
| `route` | an object with route based utilties (this, is **not** Vue route, see above) |
| `t`     | A reference to our `t` function/service                                     |
| `env`   | A reference to our `env` function/service                                   |
| `can`   | A reference to our `can` function/service                                   |
| `uri`   | A reference to our `uri` helper                                             |

