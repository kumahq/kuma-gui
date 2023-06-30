# AppView

Similar `RouteView` the `AppView` component should be used in every routable
`*View.vue` component. But it does not need to be used in a particular position
although its likely that it would be a fairly close child of the `RouteView`
component for the route:

```vue
<RouteView
  v-slot="{route}"
>
  <AppView
    :breadcrumbs="[]"
  >
    <h1>
      <RouteTitle
        :title="route.params.service"
      />
      {{ route.params.service }}
    </h1>
    ...
  </AppView>
</RouteView>
```

It contains functionality to set the breadcrumbs for the application.

## Setting breadcrumbs for the application

Only the topmost `AppView` (usually in `App.vue`) contains an instance of
`KBreadcrumbs`, all other instances of `AppView` automatically forward its
breadcrumbs to the top most `AppView` in order to be combined and rendered using
`KBreadcrumbs`.

Therefore you only need to specify the breadcrumbs for your `*View.vue`
route/view component, the breadcrumbs will automatically be prepended with the
breadcrumbs from any parent components in a nested route structure.

You can of course specify mutiple breadcrumbs for a single route/view component.

```vue
<AppView
  :breadcrumbs="[
    {
      to: {
        name: 'route-name-view',
      },
      text: 'The Breadcrumb Text'
    },
  ]"
>
...
</AppView>
```

