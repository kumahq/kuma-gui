---
type: component
---
# AppView

Similar to `RouteView`, the `AppView` component should be used in every
routable `*View.vue` component. But it does not need to be used in a particular
position although its likely that it would be a fairly close child of the
`RouteView` component for the route:

```vue
<RouteView v-slot="{ route }">
  <AppView
    :breadcrumbs="[]"
  >
    <h1>
      <RouteTitle
        :title="route.params.service"
      />
    </h1>
    ...
  </AppView>
</RouteView>
```

`AppView` mainly contains functionality to set the breadcrumbs for the
application, but also includes a slot for correctly positioning the
header/title for the page.

::: warning
Even if you do not need to set a breadcrumb please still wrap your route/page
in an `AppView`. This means every route/page is consistent.
:::

## Setting breadcrumbs for the application

Only the topmost `AppView` (usually in `App.vue`) contains an instance of
`XBreadcrumbs`, all other instances of `AppView` automatically forward its
breadcrumbs to the top most `AppView` in order to be combined and rendered using
`XBreadcrumbs`.

Therefore you only need to specify the breadcrumbs for your `*View.vue`
route/view component, the breadcrumbs will automatically be prepended with the
breadcrumbs from any parent components in a nested route structure.

```vue
<AppView
  :breadcrumbs="[
    {
      to: {
        name: 'route-name-view',
      },
      text: 'The Breadcrumb Text',
    },
  ]"
>
...
</AppView>
```

You can of course specify multiple breadcrumbs for a single route/view component.

```vue
<AppView
  :breadcrumbs="[
    {
      to: {
        name: 'route-name-view',
      },
      text: 'The Breadcrumb Text',
    },
    {
      to: {
        name: 'route-sub-name-view',
      },
      text: 'The Sub Breadcrumb Text',
    },
  ]"
>
...
</AppView>
```

If you need to tell the application not to show any breadcrumbs all (for example a child route that is fullscreen). Specify an empty set of breadcrumbs.

This is different to specify no breadcrumb property at all, specifying no property all all will just not append a new breadcrumb to the current set.

```vue
<AppView :breadcrumbs="[]">
...
</AppView>
```

