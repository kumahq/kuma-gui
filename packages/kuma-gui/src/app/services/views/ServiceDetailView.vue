<template>
  <RouteView
    name="service-detail-view"
    :params="{
      mesh: '',
      service: '',
      page: 1,
      size: Number,
      s: '',
      proxy: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
    v-slot="{ can, route, t, me, uri }"
  >
    <AppView>
      <div
        class="stack"
      >
        <DataLoader
          :src="uri(sources, `/meshes/:mesh/service-insights/:name`, {
            mesh: route.params.mesh,
            name: route.params.service,
          })"
          v-slot="{ data }"
        >
          <XAboutCard
            :title="t('services.internal-service.about.title')"
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
                <template v-if="data.addressPort">
                  <XCopyButton
                    variant="badge"
                    format="default"
                    :text="data.addressPort"
                  />
                </template>

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
            <h3>{{ t('services.detail.data_plane_proxies') }}</h3>
          </template>

          <search>
            <form
              class="search-form"
              @submit.prevent
            >
              <XSearch
                class="search-field"
                :keys="['name', 'tag', ...(can('use zones') ? ['zone'] : []), 'namespace', 'label']"
                :value="route.params.s"
                @change="(s) => route.update({ page: 1, s })"
              />
            </form>
          </search>
          <DataLoader
            :src="uri(dataplaneSources, `/meshes/:mesh/dataplanes/for/service-insight/:service`, {
              mesh: route.params.mesh,
              service: route.params.service,
            }, {
              page: route.params.page,
              size: route.params.size,
              search: route.params.s,
            })"
            variant="list"
            v-slot="{ data }"
          >
            <DataCollection
              type="data-planes"
              :items="data.items"
              :page="route.params.page"
              :page-size="route.params.size"
              :total="data.total"
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
                :items="data.items"
                :is-selected-row="(row) => row.name === route.params.proxy"
                @resize="me.set"
              >
                <template #name="{ row: item }">
                  <XAction
                    data-action
                    class="name-link"
                    :to="{
                      name: 'service-data-plane-summary-view',
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
                v-slot="{ Component }"
              >
                <SummaryView
                  v-if="route.child()"
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
                    :is="Component"
                    v-if="typeof data !== 'undefined'"
                    :items="data.items"
                  />
                </SummaryView>
              </RouterView>
            </DataCollection>
          </DataLoader>
        </XCard>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import ResourceStatus from '@/app/common/ResourceStatus.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import { sources as dataplaneSources } from '@/app/data-planes/sources'
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
