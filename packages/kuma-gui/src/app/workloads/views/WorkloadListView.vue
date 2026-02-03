<template>
  <RouteView
    name="workload-list-view"
    :params="{
      page: 1,
      size: Number,
      mesh: '',
      s: '',
    }"
    v-slot="{ route, me, uri, can, t }"
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
          <XLayout
            variant="y-stack"
          >
            <search>
              <form
                class="search-form"
                @submit.prevent
              >
                <XSearch
                  class="search-field"
                  :keys="['name', 'namespace', ...(can('use zones') ? ['zone'] : []), 'label']"
                  :value="route.params.s"
                  @change="(s) => route.update({ page: 1, s })"
                />
              </form>
            </search>
            <DataLoader
              :data="[data]"
              :errors="[error]"
              variant="list"
            >
              <DataCollection
                v-if="typeof data !== 'undefined'"
                :items="data.items"
                :total="data.total"
                :page="route.params.page"
                :page-size="route.params.size"
                @change="route.update"
              >
                <AppCollection
                  :items="data.items"
                  type="workload" 
                  :headers="[
                    { ...me.get('headers.name'), label: t('workloads.routes.items.headers.name'), key: 'name' },
                    { ...me.get('headers.namespace'), label: t('workloads.routes.items.headers.namespace'), key: 'namespace' },
                    ...(can('use zones') ? [{ ...me.get('headers.zone'), label: t('workloads.routes.items.headers.zone'), key: 'zone' }] : []),
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
                    {{ item.status.dataplaneProxies.connected }} /
                    {{ item.status.dataplaneProxies.healthy }} /
                    {{ item.status.dataplaneProxies.total }}
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
              </DataCollection>

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
            </DataLoader>
          </XLayout>
        </XCard>
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script setup lang="ts">
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import { sources } from '@/app/workloads/sources'
</script>
<style scoped lang="scss">
.search-field {
  width: 100%;
}
</style>
