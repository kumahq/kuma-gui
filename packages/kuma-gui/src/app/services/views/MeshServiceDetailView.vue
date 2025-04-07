<template>
  <RouteView
    name="mesh-service-detail-view"
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
    v-slot="{ can, route, t, uri, me }"
  >
    <AppView>
      <XLayout type="stack">
        <XAboutCard
          :title="t('services.mesh-service.about.title')"
          :created="props.data.creationTime"
          :modified="props.data.modificationTime"
        >
          <DefinitionCard layout="horizontal">
            <template #title>
              {{ t('http.api.property.state') }}
            </template>

            <template #body>
              <XBadge
                :appearance="props.data.spec.state === 'Available' ? 'success' : 'danger'"
              >
                {{ props.data.spec.state }}
              </XBadge>
            </template>
          </DefinitionCard>
          <DefinitionCard
            v-if="props.data.namespace.length > 0"
            layout="horizontal"
          >
            <template #title>
              {{ t('http.api.property.namespace') }}
            </template>

            <template #body>
              <XBadge appearance="decorative">
                {{ props.data.namespace }}
              </XBadge>
            </template>
          </DefinitionCard>
          <DefinitionCard
            v-if="can('use zones') && props.data.zone"
            layout="horizontal"
          >
            <template
              #title
            >
              {{ t('http.api.property.zone') }}
            </template>
            <template
              #body
            >
              <XBadge appearance="decorative">
                <XAction
                  :to="{
                    name: 'zone-cp-detail-view',
                    params: {
                      zone: props.data.zone,
                    },
                  }"
                >
                  {{ props.data.zone }}
                </XAction>
              </XBadge>
            </template>
          </DefinitionCard>
          <DefinitionCard layout="horizontal">
            <template
              #title
            >
              {{ t('http.api.property.ports') }}
            </template>
            <template
              #body
            >
              <template v-if="props.data.spec.ports.length">
                <KumaPort
                  v-for="connection in props.data.spec.ports"
                  :key="connection.port"
                  :port="{
                    ...connection,
                    targetPort: undefined,
                  }"
                />
              </template>
              <template v-else>
                {{ t('common.detail.none') }}
              </template>
            </template>
          </DefinitionCard>
          <DefinitionCard layout="horizontal">
            <template
              #title
            >
              {{ t('http.api.property.selector') }}
            </template>
            <template
              #body
            >
              <template v-if="Object.keys(props.data.spec.selector.dataplaneTags).length">
                <XBadge
                  v-for="(value, key) in props.data.spec.selector.dataplaneTags"
                  :key="`${key}:${value}`"
                  appearance="info"
                >
                  {{ key }}:{{ value }}
                </XBadge>
              </template>
              <template v-else>
                {{ t('common.detail.none') }}
              </template>
            </template>
          </DefinitionCard>
        </XAboutCard>

        <XCard>
          <template #title>
            {{ t('services.detail.hostnames.title') }}
          </template>

          <DataLoader
            :src="uri(servicesSources, '/meshes/:mesh/:serviceType/:serviceName/_hostnames', {
              mesh: route.params.mesh,
              serviceType: 'meshservices',
              serviceName: route.params.service,
            })"
          >
            <template #loadable="{ data: hostnames }">
              <DataCollection
                type="hostnames"
                :items="hostnames?.items ?? [undefined]"
              >
                <AppCollection
                  type="hostnames-collection"
                  data-testid="hostnames-collection"
                  :items="hostnames?.items"
                  :headers="[
                    { ...me.get('headers.hostname'), label: t('services.detail.hostnames.hostname'), key: 'hostname' },
                    { ...me.get('headers.zones'), label: t('services.detail.hostnames.zone'), key: 'zones' },
                  ]"
                  @resize="me.set"
                >
                  <template #hostname="{ row: item }">
                    <b>
                      <XCopyButton
                        :text="item.hostname"
                      />
                    </b>
                  </template>
                  <template #zones="{ row: item }">
                    <XLayout type="separated">
                      <XBadge
                        v-for="(zone, index) of item.zones"
                        :key="index"
                        appearance="decorative"
                      >
                        <XAction
                          :to="{
                            name: 'zone-cp-detail-view',
                            params: {
                              zone: zone.name,
                            },
                          }"
                        >
                          {{ zone.name }}
                        </XAction>
                      </XBadge>
                    </XLayout>
                  </template>
                </AppCollection>
              </DataCollection>
            </template>
          </DataLoader>
        </XCard>

        <XCard>
          <template #title>
            {{ t('services.detail.dpp-status.title') }}
          </template>

          <XLayout
            type="columns"
            class="columns-with-borders"
          >
            <ResourceStatus
              :total="props.data.status.dataplaneProxies.total"
              :online="props.data.status.dataplaneProxies.connected"
              data-testid="connected-dpps"
            >
              <template #icon>
                <XIcon name="connected" />
              </template>
              <template #title>
                {{ t('services.detail.dpp-status.connected') }}
              </template>
            </ResourceStatus>

            <ResourceStatus
              :total="props.data.status.dataplaneProxies.healthy"
              data-testid="healthy-dpps"
            >
              <template #icon>
                <XIcon name="health" />
              </template>
              <template #title>
                {{ t('services.detail.dpp-status.healthy') }}
              </template>
            </ResourceStatus>
          </XLayout>
        </XCard>

        <div>
          <XCard
            class="mt-4"
          >
            <template #title>
              {{ t('services.detail.data_plane_proxies') }}
            </template>
            <search>
              <FilterBar
                class="data-plane-proxy-filter"
                :placeholder="`name:dataplane-name`"
                :query="route.params.s"
                :fields="{
                  name: { description: 'filter by name or parts of a name' },
                  protocol: { description: 'filter by “kuma.io/protocol” value' },
                  tag: { description: 'filter by tags (e.g. “tag: version:2”)' },
                }"
                @change="(e) => route.update({
                  page: 1,
                  ...Object.fromEntries(e.entries()) as Record<string, string | undefined>,
                })"
              />

              <XFilterBar
                :default-value="route.params.s"
                @submit="({ raw, ...rest }) => route.update({
                  page: 1,
                  s: Object.entries(rest).map((v) => v.join(':')).join(' '),
                })"
              />
            </search>
            <DataLoader
              :src="uri(sources, '/meshes/:mesh/dataplanes/for/mesh-service/:tags', {
                mesh: route.params.mesh,
                tags: JSON.stringify({
                  ...(can('use zones') && props.data.zone ? {
                    'kuma.io/zone': props.data.zone,
                  } : {}),
                  ...props.data.spec.selector.dataplaneTags,
                }),
              }, {
                page: route.params.page,
                size: route.params.size,
                search: route.params.s,
              })"
            >
              <template
                #loadable="{ data: dataplanes }"
              >
                <DataCollection
                  type="data-planes"
                  :items="dataplanes?.items ?? [undefined]"
                  :page="route.params.page"
                  :page-size="route.params.size"
                  :total="dataplanes?.total"
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
                    :items="dataplanes?.items"
                    :is-selected-row="(row) => row.name === route.params.proxy"
                    @resize="me.set"
                  >
                    <template #name="{ row: item }">
                      <XAction
                        class="name-link"
                        :to="{
                          name: 'mesh-service-data-plane-summary-view',
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
                        data-action
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
                        v-if="typeof dataplanes !== 'undefined'"
                        :items="dataplanes.items"
                      />
                    </SummaryView>
                  </RouterView>
                </DataCollection>
              </template>
            </DataLoader>
          </XCard>
        </div>
      </XLayout>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { MeshService } from '../data'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import FilterBar from '@/app/common/filter-bar/FilterBar.vue'
import ResourceStatus from '@/app/common/ResourceStatus.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import { sources } from '@/app/data-planes/sources'
import { sources as servicesSources } from '@/app/services/sources'
import XFilterBar from '@/app/x/components/x-filter-bar/XFilterBar.vue'

const props = defineProps<{
  data: MeshService
}>()
</script>

<style lang="scss" scoped>
.ip span {
  font-size: $kui-font-size-30;
}
search {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: stretch;
  flex-wrap: wrap;
  gap: $kui-space-70;
  margin-bottom: $kui-space-70;
}
.data-plane-proxy-filter {
  flex-basis: 350px;
  flex-grow: 1;
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
