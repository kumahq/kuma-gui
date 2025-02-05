<template>
  <RouteView
    :name="props.routeName"
    :params="{
      connection: '',
      inactive: false,
    }"
    v-slot="{ route, t }"
  >
    <DataCollection
      :items="props.data"
      :predicate="item => `${item.socketAddress.replace(':', '_')}` === route.params.connection"
      :find="true"
      v-slot="{ items }"
    >
      <AppView>
        <template #title>
          <h2>
            Inbound :{{ route.params.connection.split('_').at(-1) }}
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
import type { ZoneEgress } from '@/app/zone-egresses/data/'
import type { ZoneIngress } from '@/app/zone-ingresses/data/'

const props = defineProps<{
  data: ZoneIngress[] | ZoneEgress[]
  networking: ZoneIngress['networking'] | ZoneEgress['networking']
  routeName: string
}>()
</script>
