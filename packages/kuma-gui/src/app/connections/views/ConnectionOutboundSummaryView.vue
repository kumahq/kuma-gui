<template>
  <RouteView
    name="connection-outbound-summary-view"
    :params="{
      connection: '',
      inactive: false,
    }"
    v-slot="{ route, t }"
  >
    <AppView>
      <template #title>
        <h2>
          Outbound {{ route.params.connection }}
        </h2>
      </template>

      <XTabs :selected="route.child()?.name">
        <template
          v-for="item in route.children"
          :key="`${item.name}`"
          #[`${item.name}-tab`]
        >
          <XAction
            :to="{
              name: item.name,
              query: {
                inactive: route.params.inactive,
              },

            }"
          >
            {{ t(`connections.routes.item.navigation.${item.name.split('-')[3]}`) }}
          </XAction>
        </template>
      </XTabs>
      <RouterView v-slot="{ Component }">
        <DataCollection
          :items="Object.entries(props.data)"
          :predicate="([key, _value]) => key === route.params.connection"
          :find="true"
          v-slot="{ items }"
        >
          <component
            :is="Component"
            :data="items[0][1]"
            :dataplane-overview="props.dataplaneOverview"
          />
        </DataCollection>
      </RouterView>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { DataplaneOverview } from '@/app/data-planes/data/'
const props = defineProps<{
  data: Record<string, any>
  dataplaneOverview: DataplaneOverview
}>()
</script>
