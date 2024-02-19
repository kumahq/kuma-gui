<template>
  <RouteView
    v-slot="{ route }"
    name="data-plane-inbound-summary-view"
    :params="{
      service: '',
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

      <NavTabs
        :children="route.children"
        :active="route.active"
        i18n-prefix="data-planes.routes.item.navigation"
      />

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
import type { DataplaneGateway, DataplaneInbound } from '../data'
import NavTabs from '@/app/common/NavTabs.vue'

const props = defineProps<{
  dataplaneType: 'standard' | 'builtin'
  gateway?: DataplaneGateway
  inbounds: DataplaneInbound[]
}>()
</script>
