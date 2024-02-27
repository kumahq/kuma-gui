<template>
  <RouteView
    v-slot="{ route, t }"
    name="connection-outbound-summary-view"
    :params="{
      service: '',
    }"
  >
    <AppView>
      <template #title>
        <h2>
          {{ route.params.service }}
        </h2>
      </template>

      <NavTabs :active-route-name="route.active?.name">
        <template
          v-for="item in route.children"
          :key="`${item.name}`"
          #[`${item.name}`]
        >
          <RouterLink
            :to="{ name: item.name }"
          >
            {{ t(`connections.routes.item.navigation.${item.name.split('-')[3]}`) }}
          </RouterLink>
        </template>
      </NavTabs>
      <RouterView v-slot="{ Component }">
        <DataCollection
          v-slot="{ items }"
          :items="props.data"
          :predicate="(item) => item.name === route.params.service"
          :find="true"
        >
          <component
            :is="Component"
            :data="items[0]"
          />
        </DataCollection>
      </RouterView>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { TrafficEntry } from '../data'
import NavTabs from '@/app/common/NavTabs.vue'
const props = defineProps<{
  data: TrafficEntry[]
}>()
</script>
