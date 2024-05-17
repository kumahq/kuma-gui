<template>
  <DataSource
    v-slot="{ data: me }: MeSource"
    src="/me"
  >
    <RouteView
      v-if="me"
      v-slot="{ can, route, t, uri }"
      name="mesh-service-detail-view"
      :params="{
        mesh: '',
        service: '',
        page: 1,
        size: me.pageSize,
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
                      {{ connection.port }}:{{ connection.targetPort }}/{{ connection.protocol }}
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
                :src="uri(sources, '/meshes/:mesh/dataplanes/for/:service', {
                  mesh: route.params.mesh,
                  service: props.data.name,
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
                      { label: 'Name', key: 'name' },
                      { label: 'Namespace', key: 'namespace' },
                      ...(can('use zones') ? [{ label: 'Zone', key: 'zone' }] : []),
                      { label: 'Certificate Info', key: 'certificate' },
                      { label: 'Status', key: 'status' },
                      { label: 'Warnings', key: 'warnings', hideLabel: true },
                      { label: 'Details', key: 'details', hideLabel: true },
                    ]"
                    :items="dataplanes?.items"
                    :total="dataplanes?.total"
                    :is-selected-row="(row) => row.name === route.params.dataPlane"
                    summary-route-name="service-data-plane-summary-view"
                    :empty-state-message="t('common.emptyState.message', { type: 'Data Plane Proxies' })"
                    :empty-state-cta-to="t('data-planes.href.docs.data_plane_proxy')"
                    :empty-state-cta-text="t('common.documentation')"
                    @change="route.update"
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

                    <template #details="{ row: item }">
                      <RouterLink
                        class="details-link"
                        data-testid="details-link"
                        :to="{
                          name: 'data-plane-detail-view',
                          params: {
                            dataPlane: item.id,
                          },
                        }"
                      >
                        {{ t('common.collection.details_link') }}

                        <ArrowRightIcon
                          decorative
                          :size="KUI_ICON_SIZE_30"
                        />
                      </RouterLink>
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
  </DataSource>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { ArrowRightIcon } from '@kong/icons'

import type { MeshService } from '../data'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import FilterBar from '@/app/common/filter-bar/FilterBar.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import { sources } from '@/app/data-planes/sources'
import type { MeSource } from '@/app/me/sources'

const props = defineProps<{
  data: MeshService
}>()
</script>

<style lang="scss" scoped>
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

.details-link {
  display: inline-flex;
  align-items: center;
  gap: $kui-space-20;
}

.data-plane-collection :deep(.name-column) {
  max-width: 400px;
}
</style>
