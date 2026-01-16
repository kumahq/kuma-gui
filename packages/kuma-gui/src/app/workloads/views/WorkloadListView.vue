<template>
  <RouteView
    name="workload-list-view"
    :params="{
      page: 1,
      size: Number,
      mesh: '',
      s: '',
    }"
    v-slot="{ route, me, uri, t }"
  >
    <RouteTitle
      :render="false"
      :title="t('workloads.routes.items.title')"
    />
    <AppView
      :docs="t('workloads.href.docs.workload')"
    >
      <XI18n
        path="workloads.routes.items.intro"
        default-path="common.i18n.ignore-error"
      />
      <DataSource
        :src="uri(sources, '/meshes/:mesh/workloads', {
          mesh: route.params.mesh,
        }, {
          page: route.params.page,
          size: route.params.size,
          search: route.params.s,
        })" 
        v-slot="{ data, error }"
      >
        <XCard>
          <DataLoader
            :data="[data]"
            :errors="[error]"
            variant="list"
          >
            <AppCollection
              v-if="typeof data !== 'undefined'"
              :items="data.items"
              type="workload" 
              :headers="[
                { ...me.get('headers.name'), label: t('workloads.routes.items.headers.name'), key: 'name' },
                { ...me.get('headers.namespace'), label: t('workloads.routes.items.headers.namespace'), key: 'namespace' },
                { ...me.get('headers.status'), label: t('workloads.routes.items.headers.dpps'), key: 'dpps' },
                { ...me.get('headers.actions'), label: t('workloads.routes.items.headers.actions'), key: 'actions', hideLabel: true },
              ]"
            >
              <template #name="{ row: item }">
                <XAction
                  data-action
                  class="name-link"
                  :title="item.name"
                  :to="{
                    name: 'workload-summary-view',
                    params: {
                      wl: item.kri,
                    },
                    query: {
                      page: route.params.page,
                      size: route.params.size,
                      s: route.params.s,
                    },
                  }"
                >
                  {{ item.name }}
                </XAction>
              </template>
              <template #namespace="{ row: item }">
                {{ item.namespace }}
              </template>
              <template #dpps="{ row: item }">
                {{ item.dataplaneProxies.connected }} /
                {{ item.dataplaneProxies.healthy }} /
                {{ item.dataplaneProxies.total }}
              </template>

              <template #actions="{ row: item }">
                <XActionGroup>
                  <XAction
                    :to="{
                      name: 'workload-detail-view',
                      params: {
                        wl: item.kri,
                      },
                    }"
                  >
                    {{ t('common.collection.actions.view') }}
                  </XAction>
                </XActionGroup>
              </template>
            </AppCollection>
          </DataLoader>
        </XCard>

        <RouterView
          v-slot="child"
        >
          <XDrawer
            v-if="route.name !== child.route.name"
            @close="route.replace({
              name: route.name,
              params: {
                mesh: route.params.mesh,
              },
              query: {
                page: route.params.page,
                size: route.params.size,
                s: route.params.s,
              },
            })"
          >
            <component
              :is="child.Component"
              v-if="typeof data !== 'undefined'"
              :items="data.items"
            />
          </XDrawer>
        </RouterView>
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script setup lang="ts">
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import { sources } from '@/app/workloads/sources'
</script>
