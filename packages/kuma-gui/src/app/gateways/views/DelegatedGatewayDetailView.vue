<template>
  <RouteView
    name="delegated-gateway-detail-view"
    :params="{
      mesh: '',
      service: '',
      page: 1,
      size: Number,
      s: '',
      proxy: '',
    }"
    v-slot="{ can, route, t, me }"
  >
    <AppView>
      <XLayout type="stack">
        <DataLoader
          :src="`/meshes/${route.params.mesh}/service-insights/${route.params.service}`"
          v-slot="{ data }: ServiceInsightSource"
        >
          <XAboutCard
            v-if="data"
            :title="t('delegated-gateways.detail.about.title')"
            :created="data.creationTime"
            :modified="data.modificationTime"
          >
            <DefinitionCard layout="horizontal">
              <template #title>
                {{ t('http.api.property.status') }}
              </template>

              <template #body>
                <StatusBadge :status="data.status" />
              </template>
            </DefinitionCard>

            <DefinitionCard layout="horizontal">
              <template #title>
                {{ t('http.api.property.address') }}
              </template>

              <template #body>
                <XCopyButton
                  v-if="data.addressPort"
                  variant="badge"
                  format="default"
                  :text="data.addressPort"
                />

                <template v-else>
                  {{ t('common.detail.none') }}
                </template>
              </template>
            </DefinitionCard>

            <ResourceStatus
              layout="horizontal"
              :online="data.dataplanes?.online ?? 0"
              :total="data.dataplanes?.total ?? 0"
            >
              <template #title>
                {{ t('http.api.property.dataPlaneProxies') }}
              </template>
            </ResourceStatus>
          </XAboutCard>
        </DataLoader>

        <XCard>
          <template #title>
            <h3>{{ t('delegated-gateways.detail.data_plane_proxies') }}</h3>
          </template>

          <search>
            <form
              class="search-form"
              @submit.prevent="(e) => route.update({ page: 1, ...onSearch(e) })"
            >
              <XSearch
                class="search-field"
                name="s"
                placeholder="Filter by name protocol or tag..."
                :default-value="route.params.s"
              />
            </form>
          </search>
          <DataLoader
            :src="`/meshes/${route.params.mesh}/dataplanes/for/service-insight/${route.params.service}?page=${route.params.page}&size=${route.params.size}&search=${route.params.s}`"
          >
            <template
              #loadable="{ data: dataplanesData }: DataplaneOverviewCollectionSource"
            >
              <DataCollection
                type="data-planes"
                :items="dataplanesData?.items ?? [undefined]"
                :page="route.params.page"
                :page-size="route.params.size"
                :total="dataplanesData?.total"
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
                  <template #name="{ row: item }">
                    <XAction
                      data-action
                      class="name-link"
                      :to="{
                        name: 'delegated-gateway-data-plane-summary-view',
                        params: {
                          mesh: item.mesh,
                          proxy: item.id,
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
      </XLayout>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import ResourceStatus from '@/app/common/ResourceStatus.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import type { DataplaneOverviewCollectionSource } from '@/app/data-planes/sources'
import type { ServiceInsightSource } from '@/app/services/sources'
import XSearch from '@/app/x/components/x-search/XSearch.vue'
const onSearch = (e: Event) => {
  return Object.fromEntries(new FormData(e.target as HTMLFormElement).entries())
}
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
