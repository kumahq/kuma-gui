<template>
  <RouteView
    name="subscription-summary-view"
    :params="{
      subscription: '',
    }"
    v-slot="{ route, t }"
  >
    <DataCollection
      :items="props.data"
      :predicate="item => item.id === route.params.subscription"
    >
      <template
        #item="{ item }"
      >
        <AppView>
          <template #title>
            <h2>
              {{ item.zoneInstanceId ?? item.globalInstanceId }}
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
                }"
              >
                {{ t(`subscriptions.routes.item.navigation.${name}`) }}
              </XAction>
            </template>
          </XTabs>

          <RouterView
            v-slot="{ Component }"
          >
            <component
              :is="Component"
              :data="item"
            >
              <slot name="default" />
            </component>
          </RouterView>
        </AppView>
      </template>
    </DataCollection>
  </RouteView>
</template>

<script lang="ts" setup>
import type { KDSSubscription } from '@/app/zones/data/'

const props = defineProps<{
  data: KDSSubscription[]
}>()
</script>
