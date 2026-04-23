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
      <XLayout variant="y-stack">
        <XCard
          data-testid="mesh-service-about-section"
        >
          <template #title>
            {{ t('services.mesh-service.about.title') }}
          </template>
          <DataLoader
            :data="[props.data]"
            v-slot="{ data: [service] }"
          >
            <XTimespan
              :start="service.creationTime"
              :end="service.modificationTime"
            />
            <XDl variant="x-stack">
              <div>
                <dt>
                  {{ t('http.api.property.state') }}
                </dt>
                <dd>
                  <XBadge
                    :appearance="service.spec.state === 'Available' ? 'success' : 'danger'"
                  >
                    {{ service.spec.state }}
                  </XBadge>
                </dd>
              </div>
              <div
                v-if="service.namespace.length > 0"
              >
                <dt>
                  {{ t('http.api.property.namespace') }}
                </dt>
                <dd>
                  <XBadge appearance="decorative">
                    {{ service.namespace }}
                  </XBadge>
                </dd>
              </div>
              <div
                v-if="can('use zones') && service.zone"
              >
                <dt>
                  {{ t('http.api.property.zone') }}
                </dt>
                <dd>
                  <XAction
                    :to="{
                      name: 'zone-cp-detail-view',
                      params: {
                        zone: service.zone,
                      },
                    }"
                  >
                    <XBadge appearance="decorative">
                      {{ service.zone }}
                    </XBadge>
                  </XAction>
                </dd>
              </div>
              <div>
                <dt>
                  {{ t('http.api.property.ports') }}
                </dt>
                <dd>
                  <template v-if="service.spec.ports.length">
                    <XLayout
                      variant="separated"
                      truncate
                    >
                      <KumaPort
                        v-for="connection in service.spec.ports"
                        :key="connection.port"
                        :port="{
                          ...connection,
                          targetPort: undefined,
                        }"
                      />
                    </XLayout>
                  </template>
                  <template v-else>
                    {{ t('common.detail.none') }}
                  </template>
                </dd>
              </div>
              <div>
                <dt>
                  {{ t('http.api.property.selector') }}
                </dt>
                <dd>
                  <template v-if="Object.keys(service.spec.selector.dataplaneTags).length">
                    <XLayout
                      variant="separated"
                      truncate
                    >
                      <XBadge
                        v-for="(value, key) in service.spec.selector.dataplaneTags"
                        :key="`${key}:${value}`"
                        appearance="info"
                      >
                        {{ key }}:{{ value }}
                      </XBadge>
                    </XLayout>
                  </template>
                  <template v-else>
                    {{ t('common.detail.none') }}
                  </template>
                </dd>
              </div>
              <template
                v-for="labels in [Object.entries(service.labels)]"
                :key="typeof labels"
              >
                <div v-if="labels.length > 0">
                  <dt>{{ t('services.routes.item.labels') }}</dt>
                  <dd>
                    <XLayout
                      variant="separated"
                      truncate
                    >
                      <template
                        v-for="kumaRe in [/^(.+\.)?kuma\.io\//]"
                        :key="typeof kumaRe"
                      >
                        <XBadge
                          v-for="[key, value] in labels"
                          :key="key"
                          :appearance="kumaRe.test(key) ? 'info' : 'decorative'"
                        >
                          {{ key }}:{{ value }}
                        </XBadge>
                      </template>
                    </XLayout>
                  </dd>
                </div>
              </template>
            </XDl>
          </DataLoader>
        </XCard>

        <XCard>
          <template #title>
            {{ t('services.detail.hostnames.title') }}
          </template>

          <DataLoader
            :data="[props.data]"
            variant="list"
            v-slot="{ data: [service] }"
          >
            <DataLoader
              :src="uri(servicesSources, '/meshes/:mesh/:serviceType/:serviceName/_hostnames', {
                mesh: route.params.mesh,
                serviceType: 'meshservices',
                serviceName: service.id,
              })"
              variant="list"
              v-slot="{ data: [hostnames] }"
            >
              <DataCollection
                type="hostnames"
                :items="hostnames.items"
              >
                <AppCollection
                  type="hostnames-collection"
                  data-testid="hostnames-collection"
                  :items="hostnames.items"
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
                    <XLayout variant="separated">
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
            </DataLoader>
          </DataLoader>
        </XCard>

        <XCard
          v-if="!(props.data instanceof Error) && props.data?.spec.identities.length"
          data-testid="mesh-service-identities"
        >
          <template #title>
            {{ t('services.detail.identities.title') }}
          </template>
          <AppCollection
            type="mesh-identities-collection"
            :items="props.data.spec.identities"
            :headers="[
              { ...me.get('headers.identity'), label: t('services.detail.identities.identity'), key: 'identity' },
              { ...me.get('headers.type'), label: t('services.detail.identities.type'), key: 'type' },
            ]"
            @resize="me.set"
          >
            <template #identity="{ row: item }">
              <b>
                <XCopyButton
                  :text="item.value"
                />
              </b>
            </template>
            <template #type="{ row: item }">
              <XLayout variant="separated">
                <XBadge
                  appearance="decorative"
                >
                  {{ item.type }}
                </XBadge>
              </XLayout>
            </template>
          </AppCollection>
        </XCard>

        <XCard>
          <template #title>
            {{ t('services.detail.dpp-status.title') }}
          </template>

          <DataLoader
            :data="[props.data]"
            v-slot="{ data: [service] }"
          >
            <XLayout
              variant="columns"
              class="columns-with-borders"
            >
              <ResourceStatus
                :total="service.status.dataplaneProxies.total"
                :online="service.status.dataplaneProxies.connected"
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
                :total="service.status.dataplaneProxies.healthy"
                data-testid="healthy-dpps"
              >
                <template #icon>
                  <XIcon name="healthy" />
                </template>
                <template #title>
                  {{ t('services.detail.dpp-status.healthy') }}
                </template>
              </ResourceStatus>
            </XLayout>
          </DataLoader>
        </XCard>

        <XCard>
          <template #title>
            {{ t('services.detail.data_plane_proxies') }}
          </template>

          <XLayout
            variant="y-stack"
          >
            <search>
              <form
                @submit.prevent
              >
                <XSearch
                  :keys="['name', 'tag', 'label']"
                  :value="route.params.s"
                  @change="(s) => route.update({ page: 1, s })"
                />
              </form>
            </search>
            <DataLoader
              :data="[props.data]"
              variant="list"
              v-slot="{ data: [service] }"
            >
              <DataLoader
                :src="uri(sources, '/meshes/:mesh/dataplanes/for/mesh-service/:tags', {
                  mesh: route.params.mesh,
                  tags: JSON.stringify({
                    ...service.spec.selector.dataplaneTags,
                  }),
                }, {
                  page: route.params.page,
                  size: route.params.size,
                  search: `${route.params.s}${can('use zones') && service.zone.length > 0 ? ` zone:${service.zone}`: ''}`,
                })"
                variant="list"
                v-slot="{ data: [dataplanes] }"
              >
                <DataCollection
                  type="data-planes"
                  :items="dataplanes.items"
                  :page="route.params.page"
                  :page-size="route.params.size"
                  :total="dataplanes.total"
                  @change="route.update"
                >
                  <AppCollection
                    class="data-plane-collection"
                    data-testid="data-plane-collection"
                    :headers="[
                      { ...me.get('headers.name'), label: 'Name', key: 'name' },
                      { ...me.get('headers.namespace'), label: 'Namespace', key: 'namespace' },
                      ...(can('use zones') ? [{ ...me.get('headers.zone'), label: 'Zone', key: 'zone' }] : []),
                      { ...me.get('headers.certificate'), label: 'Certificate info', key: 'certificate' },
                      { ...me.get('headers.status'), label: 'Status', key: 'status' },
                      { ...me.get('headers.warnings'), label: 'Warnings', key: 'warnings', hideLabel: true },
                      { ...me.get('headers.actions'), label: 'Actions', key: 'actions', hideLabel: true },
                    ]"
                    :items="dataplanes.items"
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
                    <XDrawer
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
                    </XDrawer>
                  </RouterView>
                </DataCollection>
              </DataLoader>
            </DataLoader>
          </XLayout>
        </XCard>
      </XLayout>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { MeshService } from '../data'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import ResourceStatus from '@/app/common/ResourceStatus.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import { sources } from '@/app/data-planes/sources'
import { sources as servicesSources } from '@/app/services/sources'

const props = defineProps<{
  data: MeshService | Error | undefined
}>()
</script>

<style lang="scss" scoped>
.ip span {
  font-size: var(--x-font-size-30);
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
