<template>
  <RouteView
    v-slot="{ route, t }"
    name="connection-inbound-summary-view"
    :params="{
      connection: '',
      inactive: false,
    }"
  >
    <!-- if its a built in gateway, just take the first one, all the data we use here is the same -->
    <!-- otherwise find the exact inbound -->
    <DataCollection
      v-slot="{ items }"
      :items="props.data"
      :predicate="props.dataplaneOverview.dataplane.networking.type === 'gateway' ? (item) => true : (item) => item.name === route.params.connection"
      :find="true"
    >
      <AppView>
        <template #title>
          <h2>
            Inbound {{ route.params.connection.replace('localhost', '').replace('_', ':') }}
          </h2>
        </template>

        <NavTabs :active-route-name="route.active?.name">
          <template
            v-for="{ name } in route.children"
            :key="name"
            #[`${name}`]
          >
            <RouterLink
              :to="{
                name,
                query: {
                  inactive: route.params.inactive ? null : undefined,
                },
              }"
              :data-testid="`${name}-tab`"
            >
              {{ t(`connections.routes.item.navigation.${name.split('-')[3]}`) }}
            </RouterLink>
          </template>
        </NavTabs>

        <RouterView v-slot="child">
          <component
            :is="child.Component"
            :data="items[0]"
            :dataplane-overview="props.dataplaneOverview"
          />
        </RouterView>
      </AppView>
    </DataCollection>
  </RouteView>
</template>

<script lang="ts" setup>
import NavTabs from '@/app/common/NavTabs.vue'
import type { DataplaneInbound, DataplaneOverview } from '@/app/data-planes/data/'

const props = defineProps<{
  data: DataplaneInbound[]
  dataplaneOverview: DataplaneOverview
}>()
</script>
