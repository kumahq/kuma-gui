# RouteView

Our `RouteView` component should be used as the top-most component for every
routable `*View.vue` component.

It contains functionality to make it easy to set top-level DOM values that you
usually woudn't have direct access to.

## Setting HTML node attributes

**Note: Currently we only support setting the className if you need to add
further attributes PRs are welcome**

```vue
<RouteView
  :attrs="{
    class: 'my-html-class'
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

## Setting the `<title>` of the page

`RouteView` works in tandem with `RouteTitle` allowing you to set the HTML title for
the page from anywhere in your `*View.vue` component.

```vue
<RouteView>
  <h1>
    <RouteTitle
      title="The title"
    />
    The title
  </h1>
...
</RouteView>
```

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

We **currently do not render** the contents of the `title=""` attribute in the same
place that you use the `RouteTitle`, but in the future we might. Therefore you
would only have to set the title once, and it will be render both to the HTML
`<title>` and to your page header (say inside a `<h1>`)

## v-slot="{route}"

RouteView also exports a subset of the `route`. **This is not an entire
`vue-router` route as you know it!**. This lets you easily set titles (or other
things) based on the route params (or load data using the route params to set
your title)

```vue
<RouteView
  v-slot="{route}"
>
  <h1>
    <RouteTitle
      :title="route.params.service"
    />
  </h1>
...
</RouteView>
```

