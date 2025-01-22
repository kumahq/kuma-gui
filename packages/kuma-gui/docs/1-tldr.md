---
section: Overview
---
# TLDR

## Run the thing

Clone the repository if you haven't already and `cd` into it:

```sh
git clone https://github.com/kumahq/kuma-gui.git
cd kuma-gui
```

Start the development server (you'll need `node` installed)

```sh
make run
```

Visit the GUI at <http://localhost:8080>

::: warning
`make help` gives you a list of all make targets and a short description for what they are for.
:::

## Add/build a page/route

::: warning
The easiest thing to do is to copy/paste a similar route from elsewhere and then amend your new version.
:::

Routing configuration is stored in a modules `routes.ts` file i.e.
`@/app/module.name/routes.ts`. If your route is brand new add the JSON
configuration in there.

:::danger
All route views should use `RouteView`s and `AppView`s. Please make use of
Vue's nested routing/`RouterView` when required. Remember you can pass data
down through `RouterView`s.
:::

TLDR:

```vue
<RouteView
  v-slot="{ route }"
  name="the-name-of-the-route"
  :params="{
    onlySpecifyTheParamsYouNeed: '',
    policyName: '',
    page: 1,
  }"
>
  <AppView>
    <!-- your content goes in here -->
    Page: {{ route.params.page }}

    <!-- Please make use of Nested Routing when necessary -->
    <RouterView
      v-slot="{ Component }"
    >
      <component
        :is="Component"
        :data="{ passDataToTheChildRoute: true }"
      />
    </RouterView>
  </AppView>
</RouteView>
```

For more detail see:

- [RouteView](/src/app/application/components/route-view/README)
- [AppView](/src/app/application/components/app-view/README)

## Working with data

All read data interactions should use `DataSource` and or `DataLoader`.

:::warning
`DataSource` is **non-blocking** i.e. its contents will show always whether the data
is loaded or not.

`DataLoader` is **blocking** and can be used with or without `DataSource`
depending on which parts of the UI you want to be blocked. `DataLoader` can
also load multiple `DataSource`s.
:::

We often use `DataCollection` for filtering/finding data inline and providing
empty states.

:::warning
`DataSource` has no visual elements/states.

`DataLoader` has automatic (but slottable) loading and error states.

`DataCollection` has an automatic (but slottable) empty state.
:::

As `DataLoader` has visual states for loading and error states, we generally
only use `DataSource` for more low level data-requesting and/or loading from
multiple sources at once and/or more complex data requesting sequences.

TLDR:

```vue
<DataSource
  v-slot="{ data }"
  src="/mesh-insights"
>
  Always show me (guard for data is required as it might be undefined)
  {{ data?.items.length }}
</DataSource>
...
<DataLoader
  v-slot="{ data }"
  src="/mesh-insights"
>
  Only show me once the data is loaded
  {{ data.items.length }}

  <DataCollection
    :items="data.items"
  >
    We are guaranteed to have at least one item,
    otherwise the default empty state is shown.
    {{ data.items[0].name }}
  </DataCollection>
</DataLoader>
```

You could also use our `uri` helper for creating URIs/URLs for the `src`
parameter to enable auto-completion of URIs and type hints for the outputted
data.

For more detail see:

- [DataSource](/src/app/application/components/data-source/README)
- [DataLoader](/src/app/application/components/data-source/README#simple-dataloader-usage)
- [DataCollection](/src/app/application/components/data-collection/README)


## GUI Components

Apart from our `Data*` components we also have a set of `X*` components which
are generic GUI specific components.

These 'x' components are generally 'thin wrappers' over either native Vue
components or Kongponents to make them easier to work with.

We globally import our generic GUI `X*` and our `Data*` components.

Links:

- X\* components [These docs](/src/app/x/README)
- Data\* Components [These docs](/src/app/application/components/data-source/README)
- Design Tokens from <https://github.com/Kong/design-tokens>
- Icons from <https://github.com/Kong/icons>

## Test the thing

CLI based unit tests

```sh
make test/unit
```

Browser based 'e2e' tests

```sh
make test/e2e
```

:::warning
When running e2e tests locally the GUI must already be running at <http://localhost:8080/gui>.
You can use `make run` to do this in a separate terminal to do this.

You can also use `export KUMA_BASE_URL=http://localhost:8081` to tell the tests
to use a different URL, and `export KUMA_TEST_BROWSER=chrome` to tell the tests
to run in a non-headless browser.
:::

If you are new to the GUI you will probably be writing e2e tests rather than
unit tests. We have very little logic in the GUI that isn't tested elsewhere
and most new GUI features can be built using existing utilities, components and
tooling.

