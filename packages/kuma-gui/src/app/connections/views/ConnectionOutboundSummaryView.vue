<template>
  <RouteView
    :name="props.routeName"
    :params="{
      inactive: Boolean,
      connection: '',
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
            {{ t(`connections.routes.item.navigation.${item.name.split('-')[5]}`) }}
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
            :networking="props.networking"
          />
        </DataCollection>
      </RouterView>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { DataplaneNetworking } from '@/app/legacy-data-planes/data/'
import type { ZoneEgress } from '@/app/zone-egresses/data/'
import type { ZoneIngress } from '@/app/zone-ingresses/data/'
const props = defineProps<{
  data: Record<string, any>
  networking: DataplaneNetworking | ZoneIngress['networking'] | ZoneEgress['networking']
  routeName: string
}>()
</script>
