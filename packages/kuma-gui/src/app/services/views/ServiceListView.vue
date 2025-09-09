<template>
  <RouteView
    name="service-list-view"
    :params="{
      page: 1,
      size: Number,
      mesh: '',
      service: '',
      s: '',
    }"
    v-slot="{ route, t, uri, me }"
  >
    <RouteTitle
      :render="false"
      :title="t(`services.routes.items.title`)"
    />
    <AppView
      :docs="t('services.href.docs')"
    >
      <XCard>
        <XLayout>
          <search>
            <form @submit.prevent>
              <XSearch
                class="search-field"
                :keys="['name']"
                :value="route.params.s"
                @change="(s) => route.update({ page: 1, s })"
              />
            </form>
          </search>
          <DataLoader
            :src="uri(sources, '/meshes/:mesh/service-insights/of/:serviceType', {
              mesh: route.params.mesh,
              serviceType: 'internal',
            },{
              page: route.params.page,
              size: route.params.size,
              search: route.params.s,
            })"
            variant="list"
            v-slot="{ data }"
          >
            <DataCollection
              type="services"
              :items="data.items"
              :page="route.params.page"
              :page-size="route.params.size"
              :total="data.total"
              @change="route.update"
            >
              <AppCollection
                class="service-collection"
                data-testid="service-collection"
                :headers="[
                  { ...me.get('headers.name'), label: 'Name', key: 'name' },
                  { ...me.get('headers.addressPort'), label: 'Address', key: 'addressPort' },
                  { ...me.get('headers.online'), label: 'DP proxies (online / total)', key: 'online' },
                  { ...me.get('headers.status'), label: 'Status', key: 'status' },
                  { ...me.get('headers.actions'), label: 'Actions', key: 'actions', hideLabel: true },
                ]"
                :items="data.items"
                :is-selected-row="(row) => row.name === route.params.service"
                @resize="me.set"
              >
                <template #name="{ row: item }">
                  <XCopyButton :text="item.name">
                    <XAction
                      data-action
                      :to="{
                        name: 'service-detail-view',
                        params: {
                          mesh: item.mesh,
                          service: item.name,
                        },
                        query: {
                          page: route.params.page,
                          size: route.params.size,
                        },
                      }"
                    >
                      {{ item.name }}
                    </XAction>
                  </XCopyButton>
                </template>

                <template #addressPort="{ row }">
                  <XCopyButton
                    v-if="row.addressPort"
                    :text="row.addressPort"
                  />

                  <template v-else>
                    {{ t('common.collection.none') }}
                  </template>
                </template>

                <template #online="{ row: item }">
                  <template
                    v-if="item.dataplanes"
                  >
                    {{ item.dataplanes.online || 0 }} / {{ item.dataplanes.total || 0 }}
                  </template>
                  <template
                    v-else
                  >
                    {{ t('common.collection.none') }}
                  </template>
                </template>

                <template #status="{ row: item }">
                  <StatusBadge :status="item.status" />
                </template>

                <template #actions="{ row: item }">
                  <XActionGroup>
                    <XAction
                      :to="{
                        name: 'service-detail-view',
                        params: {
                          mesh: item.mesh,
                          service: item.name,
                        },
                      }"
                    >
                      {{ t('common.collection.actions.view') }}
                    </XAction>
                  </XActionGroup>
                </template>
              </AppCollection>
              <RouterView
                v-if="route.params.service"
                v-slot="child"
              >
                <XDrawer
                  @close="route.replace({
                    name: 'service-list-view',
                    params: {
                      mesh: route.params.mesh,
                    },
                    query: {
                      page: route.params.page,
                      size: route.params.size,
                    },
                  })"
                >
                  <component
                    :is="child.Component"
                    :name="route.params.service"
                    :service="data.items.find((item) => item.name === route.params.service)"
                  />
                </XDrawer>
              </RouterView>
            </DataCollection>
          </DataLoader>
        </XLayout>
      </XCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
</script>
<style lang="scss" scoped>
.search-field {
  width: 100%;
}
</style>
