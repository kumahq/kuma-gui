<template>
  <RouteView
    v-slot="{ route, t }"
    name="connection-inbound-summary-view"
    :params="{
      service: '',
      inactive: false,
    }"
  >
    <DataCollection
      v-slot="{ items }"
      :items="props.data"
      :predicate="(item) => `${item.port}` === route.params.service.split(':')[1]"
      :find="true"
    >
      <AppView>
        <template #title>
          <h2>
            Inbound {{ route.params.service }}
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
          />
        </RouterView>
      </AppView>
    </DataCollection>
  </RouteView>
</template>

<script lang="ts" setup>
import NavTabs from '@/app/common/NavTabs.vue'
import type { DataplaneInbound } from '@/app/data-planes/data/'

const props = defineProps<{
  data: DataplaneInbound[]
}>()
</script>
