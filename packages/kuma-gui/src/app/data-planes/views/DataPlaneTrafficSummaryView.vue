<template>
  <RouteView
    :name="props.routeName"
    :params="{
      inactive: Boolean,
      proxyType: '',
      connection: '',
    }"
    v-slot="{ route, t }"
  >
    <DataCollection
      :items="props.data"
      :predicate="(item) => `${item.proxyResourceName}` === route.params.connection"
      :find="true"
      v-slot="{ items }"
    >
      <AppView>
        <template #title>
          <XLayout size="small">
            <h2>
              {{ props.routeName.includes('inbound') ? 'Inbound' : 'Outbound' }}: {{ route.params.connection }}
            </h2>
            <template v-if="'state' in items[0]">
              <XBadge
                :appearance="t(`common.status.appearance.${items[0].state}`, undefined, { defaultMessage: 'neutral' })"
              >
                {{ t(`http.api.value.${items[0].state}`) }}
              </XBadge>
            </template>
          </XLayout>
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
import { DataplaneNetworkingLayout } from '../data'
import type { DataplaneNetworking } from '@/app/data-planes/data/'

const props = defineProps<{
  data: DataplaneNetworkingLayout['inbounds'] | DataplaneNetworkingLayout['outbounds']
  networking: DataplaneNetworking
  routeName: string
}>()
</script>
