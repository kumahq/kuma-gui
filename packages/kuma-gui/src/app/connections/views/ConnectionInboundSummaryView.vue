<template>
  <RouteView
    :name="props.routeName"
    :params="{
      connection: '',
      inactive: false,
    }"
    v-slot="{ route, t }"
  >
    <!-- if its a built in gateway, just take the first one, all the data we use here is the same -->
    <!-- otherwise find the exact inbound -->
    <DataCollection
      :items="props.data"
      :predicate="props.networking.type === 'gateway' ? (item) => true : (item) => item.name === route.params.connection"
      :find="true"
      v-slot="{ items }"
    >
      <AppView>
        <template #title>
          <h2>
            Inbound {{ route.params.connection.replace('localhost', '').replace('_', ':') }}
          </h2>
        </template>

        <XTabs
          :selected="route.child()?.name"
        >
          <template
            v-for="{ name } in route.children"
            :key="name"
            #[`${name}-tab`]
          >
            <XAction
              :to="{
                name,
                query: {
                  inactive: route.params.inactive,
                },
              }"
            >
              {{ t(`connections.routes.item.navigation.${name.split('-')[5]}`) }}
            </XAction>
          </template>
        </XTabs>

        <RouterView v-slot="child">
          <component
            :is="child.Component"
            :data="items[0]"
            :networking="props.networking"
          />
        </RouterView>
      </AppView>
    </DataCollection>
  </RouteView>
</template>

<script lang="ts" setup>
import type { DataplaneInbound, DataplaneNetworking } from '@/app/data-planes/data/'

const props = defineProps<{
  data: DataplaneInbound[]
  networking: DataplaneNetworking
  routeName: string
}>()
</script>
