# AppCollection

'Simple-ish' wrapper around KTable with a default common configuration
specific to our application to save repetition.

## AppCollectionActions

'Simple-ish' wrapper around KDropdownMenu with a default common configuration
specific to our application to save repetition.

## Example

In the below example, `data` and `error` would usually come from a `<DataSource />`
component, but `data` could be anything and `error` should be a standard
shaped error that also could come from anywhere.

`route.update` comes from our `<RouteView />`

```vue
<AppCollection
  :headers="[
    { label: 'Name', key: 'name' },
    /* other headers/slots should be added here */
    { label: 'Actions', key: 'actions', hideLabel: true },
  ]"
  :page-number="props.page"
  :page-size="props.size"
  :total="data?.total"
  :items="data?.items"
  :error="error"
  @change="route.update"

>
  <template #name="{ row: item }">
    <RouterLink
      :to="{
        name: 'data-plane-detail-view',
        params: {
          dataPlane: item.name
        }
      }"
    >
      {{ item.name }}
    </RouterLink>
  </template>
  <!--- other slots should be added here --->
  <template #actions="{ row: item }">
    <AppCollectionActions>
      <AppCollectionAction
        :item="{
          to: {
            name: 'data-plane-detail-view',
            params: {
              dataPlane: item.name,
            },
          },
          label: t('common.collection.actions.view'),
        }"
      />
    </AppCollectionActions>
  </template>
</AppCollection>

```
