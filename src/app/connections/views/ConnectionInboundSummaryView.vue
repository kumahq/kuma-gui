<template>
  <RouteView
    v-slot="{ route, t }"
    name="connection-inbound-summary-view"
    :params="{
      service: '',
      inactive: false,
    }"
  >
    <AppView>
      <template #title>
        <h2>
          <template v-if="props.gateway">
            {{ route.params.service }}
          </template>

          <template v-else>
            Inbound {{ route.params.service.replace('localhost_', '') }}
          </template>
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
          v-if="props.gateway"
          :gateway="props.gateway"
        />

        <DataCollection
          v-else
          v-slot="{ items }"
          :items="props.inbounds"
          :predicate="(item) => `${item.port}` === route.params.service.split(':')[1]"
          :find="true"
        >
          <component
            :is="child.Component"
            :inbound="items[0]"
            :gateway="props.gateway"
          />
        </DataCollection>
      </RouterView>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import NavTabs from '@/app/common/NavTabs.vue'
import type { DataplaneGateway, DataplaneInbound } from '@/app/data-planes/data/'

const props = defineProps<{
  dataplaneType: 'standard' | 'builtin'
  gateway?: DataplaneGateway
  inbounds: DataplaneInbound[]
}>()
</script>
