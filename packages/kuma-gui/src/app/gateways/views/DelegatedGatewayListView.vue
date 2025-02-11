<template>
  <RouteView
    name="delegated-gateway-list-view"
    :params="{
      page: 1,
      size: Number,
      mesh: '',
    }"
    v-slot="{ route, t, me, uri }"
  >
    <AppView
      :docs="t('delegated-gateways.href.docs')"
    >
      <XCard>
        <DataLoader
          :src="uri(sources, `/meshes/:mesh/service-insights/of/:serviceType`, {
            mesh: route.params.mesh,
            serviceType: 'gateway_delegated',
          }, {
            page: route.params.page,
            size: route.params.size,
          })"
        >
          <template
            #loadable="{ data }"
          >
            <DataCollection
              type="gateways"
              :items="data?.items ?? [undefined]"
              :page="route.params.page"
              :page-size="route.params.size"
              :total="data?.total"
              @change="(value) => {
                let { page } = value
                if(route.params.size !== value.size) {
                  const offset = route.params.size * Math.max(route.params.page - 1, 0)
                  page = Math.floor(offset / value.size) + 1
                }
                return route.update({
                  ...value, page,
                })
              }"
            >
              <AppCollection
                class="delegated-gateway-collection"
                data-testid="delegated-gateway-collection"
                :headers="[
                  { ...me.get('headers.name'), label: 'Name', key: 'name' },
                  { ...me.get('headers.addressPort'), label: 'Address', key: 'addressPort' },
                  { ...me.get('headers.dataplanes'), label: 'DP proxies (online / total)', key: 'dataplanes' },
                  { ...me.get('headers.status'), label: 'Status', key: 'status' },
                  { ...me.get('headers.actions'), label: 'Actions', key: 'actions', hideLabel: true },
                ]"
                :items="data?.items"
                @resize="me.set"
              >
                <template #name="{ row: item }">
                  <XCopyButton :text="item.name">
                    <XAction
                      :to="{
                        name: 'delegated-gateway-detail-view',
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

                <template #dataplanes="{ row }">
                  <template v-if="row.dataplanes">
                    {{ row.dataplanes.online || 0 }} / {{ row.dataplanes.total || 0 }}
                  </template>

                  <template v-else>
                    {{ t('common.collection.none') }}
                  </template>
                </template>

                <template #status="{ row }">
                  <StatusBadge :status="row.status" />
                </template>

                <template #actions="{ row: item }">
                  <XActionGroup>
                    <XAction
                      :to="{
                        name: 'delegated-gateway-detail-view',
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
            </DataCollection>
          </template>
        </DataLoader>
      </XCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import { sources } from '@/app/services/sources'
</script>
