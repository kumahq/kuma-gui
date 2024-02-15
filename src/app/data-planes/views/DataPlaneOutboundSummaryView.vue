<template>
  <RouteView
    v-slot="{ route }"
    name="data-plane-outbound-summary-view"
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

      <NavTabs
        anchor-route-name="data-plane-outbound-summary-view"
        i18n-prefix="data-planes.routes.item.navigation"
      />

      <RouterView v-slot="child">
        <DataCollection
          v-slot="{ items }"
          :items="props.data"
          :predicate="(item) => item.name === route.params.service"
          :find="true"
        >
          <component
            :is="child.Component"
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
