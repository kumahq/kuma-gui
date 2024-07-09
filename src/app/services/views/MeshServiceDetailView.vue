<template>
  <RouteView
    v-slot="{ can, route, t, uri, me }"
    name="mesh-service-detail-view"
    :params="{
      mesh: '',
      service: '',
      page: 1,
      size: 50,
      s: '',
      dataPlane: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
  >
    <AppView>
      <div
        class="stack"
      >
        <KCard>
          <div class="columns">
            <DefinitionCard
              v-if="props.data.status.addresses.length > 0"
            >
              <template
                #title
              >
                Addresses
              </template>
              <template
                #body
              >
                <KTruncate>
                  <span
                    v-for="address in props.data.status.addresses"
                    :key="address.hostname"
                  >
                    {{ address.hostname }}
                  </span>
                </KTruncate>
              </template>
            </DefinitionCard>
            <DefinitionCard>
              <template
                #title
              >
                Ports
              </template>
              <template
                #body
              >
                <KTruncate>
                  <KBadge
                    v-for="connection in data.spec.ports"
                    :key="connection.port"
                    appearance="info"
                  >
                    {{ connection.port }}:{{ connection.targetPort }}/{{ connection.appProtocol }}
                  </KBadge>
                </KTruncate>
              </template>
            </DefinitionCard>
            <DefinitionCard>
              <template
                #title
              >
                Dataplane Tags
              </template>
              <template
                #body
              >
                <KTruncate>
                  <KBadge
                    v-for="(value, key) in data.spec.selector.dataplaneTags"
                    :key="`${key}:${value}`"
                    appearance="info"
                  >
                    {{ key }}:{{ value }}
                  </KBadge>
                </KTruncate>
              </template>
            </DefinitionCard>
            <DefinitionCard
              v-if="data.status.vips.length > 0"
              class="ip"
            >
              <template
                #title
              >
                VIPs
              </template>
              <template
                #body
              >
                <KTruncate>
                  <span
                    v-for="address in data.status.vips"
                    :key="address.ip"
                  >
                    {{ address.ip }}
                  </span>
                </KTruncate>
              </template>
            </DefinitionCard>
          </div>
        </KCard>

        <div>
          <h3>
            {{ t('services.detail.data_plane_proxies') }}
          </h3>

          <KCard
            class="mt-4"
          >
            <DataLoader
              :src="uri(sources, '/meshes/:mesh/dataplanes/for/mesh-service/:tags', {
                mesh: route.params.mesh,
                tags: JSON.stringify(props.data.spec.selector.dataplaneTags),
              }, {
                page: route.params.page,
                size: route.params.size,
                search: route.params.s,
              })"
            >
              <template
                #loadable="{ data: dataplanes }"
              >
                <AppCollection
                  class="data-plane-collection"
                  data-testid="data-plane-collection"
                  :page-number="route.params.page"
                  :page-size="route.params.size"
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
                  :total="dataplanes?.total"
                  :is-selected-row="(row) => row.name === route.params.dataPlane"
                  summary-route-name="service-data-plane-summary-view"
                  :empty-state-message="t('common.emptyState.message', { type: 'Data Plane Proxies' })"
                  :empty-state-cta-to="t('data-planes.href.docs.data_plane_proxy')"
                  :empty-state-cta-text="t('common.documentation')"
                  @change="route.update"
                  @resize="me.set"
                >
                  <template #toolbar>
                    <FilterBar
                      class="data-plane-proxy-filter"
                      :placeholder="`name:dataplane-name`"
                      :query="route.params.s"
                      :fields="{
                        name: { description: 'filter by name or parts of a name' },
                        protocol: { description: 'filter by “kuma.io/protocol” value' },
                        tag: { description: 'filter by tags (e.g. “tag: version:2”)' },
                        ...(can('use zones') && { zone: { description: 'filter by “kuma.io/zone” value' } }),
                      }"
                      @change="(e) => route.update({
                        ...Object.fromEntries(e.entries()) as Record<string, string | undefined>,
                      })"
                    />
                  </template>

                  <template #name="{ row: item }">
                    <RouterLink
                      class="name-link"
                      :to="{
                        name: 'mesh-service-data-plane-summary-view',
                        params: {
                          mesh: item.mesh,
                          dataPlane: item.id,
                        },
                        query: {
                          page: route.params.page,
                          size: route.params.size,
                          s: route.params.s,
                        },
                      }"
                    >
                      {{ item.name }}
                    </RouterLink>
                  </template>

                  <template #namespace="{ row: item }">
                    {{ item.namespace }}
                  </template>

                  <template #zone="{ row }">
                    <RouterLink
                      v-if="row.zone"
                      :to="{
                        name: 'zone-cp-detail-view',
                        params: {
                          zone: row.zone,
                        },
                      }"
                    >
                      {{ row.zone }}
                    </RouterLink>

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

                  <template #warnings="{ row }">
                    <XIcon
                      v-if="row.isCertExpired || row.warnings.length > 0"
                      class="mr-1"
                      name="warning"
                    >
                      <ul>
                        <template v-if="row.warnings.length > 0">
                          <li>{{ t('data-planes.components.data-plane-list.version_mismatch') }}</li>
                        </template>

                        <template v-if="row.isCertExpired">
                          <li>{{ t('data-planes.components.data-plane-list.cert_expired') }}</li>
                        </template>
                      </ul>
                    </XIcon>

                    <template v-else>
                      {{ t('common.collection.none') }}
                    </template>
                  </template>

                  <template #actions="{ row: item }">
                    <XActionGroup>
                      <XAction
                        :to="{
                          name: 'data-plane-detail-view',
                          params: {
                            dataPlane: item.id,
                          },
                        }"
                      >
                        {{ t('common.collection.actions.view') }}
                      </XAction>
                    </XActionGroup>
                  </template>
                </AppCollection>
                <RouterView
                  v-if="route.params.dataPlane"
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
              </template>
            </DataLoader>
          </KCard>
        </div>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { MeshService } from '../data'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import FilterBar from '@/app/common/filter-bar/FilterBar.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import { sources } from '@/app/data-planes/sources'

const props = defineProps<{
  data: MeshService
}>()
</script>

<style lang="scss" scoped>
.ip span {
  font-size: $kui-font-size-30;
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
