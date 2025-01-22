---
type: component
---
# RouteView

Our `RouteView` component should be used as the top-most component for **every
routable `*View.vue` component**. Think of it as your `<html>` tag.

::: danger
When using this you should specify the name of the route you are creating as
the RouteView's `name` property. See `name="route-name"` in the below example.
:::

`RouteView` contains functionality for:

- ["Better" `route.params`](#better-route-params)
  - define and access reactive route params with a finer level of granularity
    to using `vue-router`s `route`
  - specify type and provide defaults for route params
  - automatically transform boolean params to boolean query params.
  - provide route params as a two-way binding
- setting top-level DOM values
  - [the HTML `<title>`](#setting-the-title-of-the-page)
  - [the HTML `class` attribute](#setting-root-node-attributes).
- [providing access to utilities/tooling commonly used in route views](#exposing-commonly-used-utilities)
  such as `t`, `can`, `me`

It generally looks something like this:

```vue
<RouteView
  name="route-name"
  :params="{
    define: ''
    route: ''
    params: false
  }"
  v-slot="{ route, t, can, me }"
>
...View contents...
</RouteView>

```

## "Better" route params

::: danger
`route` is not an instance of `vue-router`'s `route`. It is very similar but
omits some things and adds functionality to others.
:::

```vue
<RouteView
  name="route-name"
  :params="{
    mesh: ''
    service: ''
    page: 1
    checked: false
  }"
  v-slot="{ route }"
>
  Page: {{ route.params.page }}
  ...
</RouteView>
```

The above example illustrates how to define the dependencies of your route
template/view, also known as the route params. If you do not need a specific
route param in a template you should not define them in this specific
template/RouteView.

::: warning
Note: at this level there is no concept of "path vs query" params. They are
just all "params". Whether they end up being path or query params is controlled
by your routing config. If you refer to the param in a URL in your route
config, they end up being path params, if not, they are query params.
:::


Defining these "dependencies" here has several advantages:

1. Accessing `route.params` gives you autocompletion/type-checking in your IDE
2. The reactivity is finer grained. When using `vue-router`s `route.params`,
   `params` itself if the thing that is reactive, i.e. the entire object. If
   *any* route param changes, whether you use it in your template or not,
   accessing `vue-router`s `route.params` in your template will force a re-render.
   On the other hand, if you use `RouteView::params` only when a route param we
   have defined as a dependency changes forces a re-render.
3. Provide default values for the param. In the above example if `page` param
   isn't set in the route, then a query param of `?page=1` will be to the URL
   by default and `route.params.page` will equal `1`.
4. Boolean route params are transformed correctly for the URL. In the above
   example the resulting query parameter will be the existence of `?checked`
   not `?checked=true` and `?checked=false`

## Setting the `<title>` of the page

`RouteView` works in tandem with `RouteTitle` allowing you to set the HTML title for
the page in-place anywhere in your `*View.vue` component.

```vue
<RouteView
  name="route-name"
>
  <h1>
    <RouteTitle
      title="The title"
    />
  </h1>
...
</RouteView>
```

`RouteTitle` also renders the title you give it into the page, meaning that you
can easily use the same text for your page header and the HTML title. To
disable this render you can use the `render` attribute:

```vue
<RouteView
  name="route-name"
>
  <RouteTitle
    title="The title"
    :render="false"
  />
  <h1>
    Different H1 to the HTML title
  </h1>
...
</RouteView>
```

Titles are automatically joined together as you would expect in a nested route
structure and finally suffixed by the title of the product (taken from our i18n
strings).

Additionally `RouteTitle` adds additional HTML markup at the root of the
application to announce the HTML title to a11y screenreaders. A11y
announcements are not joined.

The above code, depending on nested routes could end up like:

```vue
<html>
  <head>
    <title>The title | Parent title | Kuma Manager</title>
  </head>
  ...
  <body>
    <div aria-live="assertive">Navigated to The title</div>
  </body>
</html>
```

## Setting root node attributes

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
root/html node:

```html
<html class="my-html-class">
  ...
</html>
```

The logic is careful not to remove/change any statically added attributes that
existed on the node previously, and any attributes you add will be automatically
removed when the `*View.vue` route/view component is removed from the page/DOM.

If you have 2 nested RouteViews adding the same class, navigating away/removing
only one of them will not remove the class. Only when there are no RouteViews
at all in the entire DOM tree with the class will the className be removed from
the root HTML node.

## Exposing commonly used utilities

`RouteView` exposes a selection of commonly used utilities from its default slot.

```vue
<RouteView
  name="route-name"
  v-slot="{ route, t, env, uri, can, me }"
  ...
>
```

- `t`: The usual i18n `t` function i.e. `t('a.i18n.key')`
- `env`: Access string based environment variables i.e. `env('KUMA_API_URL')`
- `can`: Make decisions based on a users abilities/enabled feature-set i.e. `can('use meshservice')`
- `uri`: Helper for creating type-safe URI strings specifically for use with [DataSource](/src/app/application/components/data-source/README)
- `route`: Access several route utilities `route.params`, `route.children`, `route.from`, `route.update()` etc.
- `me`: Accessing and writing user profile information


## Props

| Name     | Description                                                                                             |
| ------   | ------------------------------------------------------------------------------------------------------- |
| `name`   | The name of the current route file as specified in your routing configuration i.e. `services-list-view` |
| `params` | The route param dependencies of this Route                                                              |
| `attrs`  | Sets root node HTML attributes                                                                          |

## Slots

### default

#### exports

| Name    | Description                                                                  |
| ------- | ---------------------------------------------------------------------------  |
| `route` | an object with route based utilities (this, is **not** Vue route, see above) |
| `t`     | A reference to our `t` function/service                                      |
| `env`   | A reference to our `env` function/service                                    |
| `can`   | A reference to our `can` function/service                                    |
| `uri`   | A reference to our `uri` helper                                              |
| `me`    | Access to the user profile                                                   |

