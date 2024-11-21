<template>
  <RouteView
    :name="props.routeName"
    :params="{
      dataPlane: '',
    }"
    v-slot="{ route, t }"
  >
    <DataCollection
      :items="props.items"
      :predicate="item => item.id === route.params.dataPlane"
    >
      <template #empty>
        <XEmptyState>
          <template #title>
            <h2>
              {{ t('common.collection.summary.empty_title', { type: 'Data Plane Proxy' }) }}
            </h2>
          </template>
          <p>
            {{ t('common.collection.summary.empty_message', { type: 'Data Plane Proxy' }) }}
          </p>
        </XEmptyState>
      </template>
      <template
        #default="{ items: proxies }"
      >
        <template
          v-for="item in [proxies[0]]"
          :key="item.id"
        >
          <AppView>
            <template #title>
              <h2
                :class="`type-${item.dataplaneType}`"
              >
                <XAction
                  :to="{
                    name: 'data-plane-detail-view',
                    params: {
                      dataPlane: item.id,
                    },
                  }"
                >
                  <RouteTitle
                    :title="t('data-planes.routes.item.title', { name: item.name })"
                  />
                </XAction>
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
                  {{ t(`data-planes.routes.item.navigation.${name}`) }}
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
      </template>
    </DataCollection>
  </RouteView>
</template>

<script lang="ts" setup>
import { DataplaneOverview } from '../data'

const props = defineProps<{
  items: DataplaneOverview[]
  routeName: string
}>()
</script>
