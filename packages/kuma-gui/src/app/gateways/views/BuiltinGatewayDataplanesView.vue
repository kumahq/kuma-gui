<template>
  <RouteView
    name="builtin-gateway-dataplanes-view"
    :params="{
      mesh: '',
      gateway: '',
      listener: '',
      page: 1,
      size: Number,
      s: '',
      proxy: '',
    }"
    v-slot="{ can, route, t, me }"
  >
    <AppView>
      <DataSource
        :src="`/meshes/${route.params.mesh}/mesh-gateways/${route.params.gateway}`"
        v-slot="{ data: meshGateway, error }: MeshGatewaySource"
      >
        <div
          class="stack"
        >
          <XCard>
            <search>
              <form
                class="search-form"
                @submit.prevent
              >
                <XSearch
                  class="search-field"
                  :highlight="searchRegex"
                  :keys="['name', 'tag', 'zone', 'namespace']"
                  :value="route.params.s"
                  @change="(s) => route.update({ page: 1, s })"
                />
              </form>
            </search>
            <DataLoader
              :src="meshGateway === undefined ? '' : `/meshes/${route.params.mesh}/dataplanes/for/service-insight/${meshGateway.selectors[0].match['kuma.io/service']}?page=${route.params.page}&size=${route.params.size}&search=${route.params.s}`"
              :data="[meshGateway]"
              :errors="[error]"
            >
              <template
                #loadable="{ data: dataplanesData }: DataplaneOverviewCollectionSource"
              >
                <DataCollection
                  type="data-planes"
                  :items="dataplanesData?.items ?? [undefined]"
                  :total="dataplanesData?.total"
                  :page="route.params.page"
                  :page-size="route.params.size"
                  @change="route.update"
                >
                  <AppCollection
                    class="data-plane-collection"
                    data-testid="data-plane-collection"
                    :headers="[
                      { ...me.get('headers.name'), label: 'Name', key: 'name' },
                      { ...me.get('headers.namespace'), label: 'Namespace', key: 'namespace' },
                      ...(can('use zones') ? [{ ...me.get('headers.zone'), label: 'Zone', key: 'zone' }] : []),
                      { ...me.get('headers.certificate'), label: 'Certificate Info', key: 'certificate' },
                      { ...me.get('headers.status'), label: 'Status', key: 'status' },
                      { ...me.get('headers.warnings'), label: 'Warnings', key: 'warnings', hideLabel: true },
                      { ...me.get('headers.actions'), label: 'Actions', key: 'actions', hideLabel: true },
                    ]"
                    :items="dataplanesData?.items"
                    :is-selected-row="(row) => row.name === route.params.proxy"
                    @resize="me.set"
                  >
                    <template #namespace="{ row }">
                      {{ row.namespace }}
                    </template>

                    <template #name="{ row }">
                      <XAction
                        data-action
                        class="name-link"
                        :title="row.name"
                        :to="{
                          name: 'builtin-gateway-data-plane-summary-view',
                          params: {
                            mesh: row.mesh,
                            proxy: row.id,
                          },
                          query: {
                            page: route.params.page,
                            size: route.params.size,
                            s: route.params.s,
                          },
                        }"
                      >
                        {{ row.name }}
                      </XAction>
                    </template>

                    <template #zone="{ row }">
                      <XAction
                        v-if="row.zone"
                        :to="{
                          name: 'zone-cp-detail-view',
                          params: {
                            zone: row.zone,
                          },
                        }"
                      >
                        {{ row.zone }}
                      </XAction>

                      <template v-else>
                        {{ t('common.collection.none') }}
                      </template>
                    </template>

                    <template #certificate="{ row }">
                      <template v-if="row.dataplaneInsight.mTLS?.certificateExpirationTime">
                        {{ t('common.formats.datetime', { value: Date.parse(row.dataplaneInsight.mTLS.certificateExpirationTime) }) }}
                      </template>

                      <template v-else>
                        {{ t('data-planes.components.data-plane-list.certificate.none') }}
                      </template>
                    </template>

                    <template #status="{ row }">
                      <StatusBadge :status="row.status" />
                    </template>

                    <template #warnings="{ row: item }">
                      <template
                        v-for="warnings in [[
                          {
                            bool: item.dataplaneInsight.version?.kumaDp?.kumaCpCompatible === false || item.dataplaneInsight.version?.envoy?.kumaDpCompatible === false,
                            key: 'dp-cp-incompatible',
                          },
                          {
                            bool: item.isCertExpiresSoon,
                            key: 'certificate-expires-soon',
                          },
                          {
                            bool: item.isCertExpired,
                            key: 'certificate-expired',
                          },
                        ].filter(({ bool }) => bool)]"
                        :key="typeof warnings"
                      >
                        <XIcon
                          v-if="warnings.length > 0"
                          name="warning"
                          data-testid="warning"
                        >
                          <ul>
                            <li
                              v-for="{ key } in warnings"
                              :key="key"
                              :data-testid="`warning-${key}`"
                            >
                              {{ t(`data-planes.routes.items.warnings.${key}`) }}
                            </li>
                          </ul>
                        </XIcon>
                        <template v-else>
                          {{ t('common.collection.none') }}
                        </template>
                      </template>
                    </template>

                    <template #actions="{ row: item }">
                      <XActionGroup>
                        <XAction
                          :to="{
                            name: 'data-plane-detail-view',
                            params: {
                              proxy: item.id,
                            },
                          }"
                        >
                          {{ t('common.collection.actions.view') }}
                        </XAction>
                      </XActionGroup>
                    </template>
                  </AppCollection>
                  <RouterView
                    v-if="route.params.proxy"
                    v-slot="child"
                  >
                    <SummaryView
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
                        v-if="typeof dataplanesData !== 'undefined'"
                        :items="dataplanesData.items"
                      />
                    </SummaryView>
                  </RouterView>
                </DataCollection>
              </template>
            </DataLoader>
          </XCard>
        </div>
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { MeshGatewaySource } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import type { DataplaneOverviewCollectionSource } from '@/app/data-planes/sources'
import { searchRegex } from '@/app/resources/data/Resource'
</script>

<style lang="scss" scoped>
search {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: stretch;
  flex-wrap: wrap;
  gap: $kui-space-70;
  margin-bottom: $kui-space-70;
}

.search-form {
  display: flex;
  flex-basis: 350px;
  flex-grow: 1;
}

.search-field {
  flex: 1;
}

.name-link {
  display: inline-block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

.data-plane-collection :deep(.name-column) {
  max-width: 400px;
}
</style>
