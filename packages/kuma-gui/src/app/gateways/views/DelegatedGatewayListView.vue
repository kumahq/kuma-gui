<template>
  <RouteView
    name="delegated-gateway-list-view"
    :params="{
      page: 1,
      size: Number,
      mesh: '',
      s: '',
    }"
    v-slot="{ route, t, me, uri }"
  >
    <AppView
      :docs="t('delegated-gateways.href.docs')"
    >
      <XCard>
        <XLayout>
          <search>
            <form
              @submit.prevent
            >
              <XSearch
                class="search-field"
                :highlight="searchRegex"
                :keys="['name']"
                :value="route.params.s"
                @change="(s) => route.update({ page: 1, s })"
              />
            </form>
          </search>

          <DataLoader
            :src="uri(sources, `/meshes/:mesh/service-insights/of/:serviceType`, {
              mesh: route.params.mesh,
              serviceType: 'gateway_delegated',
            }, {
              page: route.params.page,
              size: route.params.size,
              search: route.params.s,
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
                @change="route.update"
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
        </XLayout>
      </XCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import { searchRegex } from '@/app/resources/data/Resource'
import { sources } from '@/app/services/sources'
</script>
<style lang="scss" scoped>
.search-field {
  width: 100%;
}
</style>
