<template>
  <DataSource
    v-slot="{ data: me }: MeSource"
    src="/me"
  >
    <RouteView
      v-if="me"
      v-slot="{ can, route, t }"
      name="data-plane-list-view"
      :params="{
        page: 1,
        size: me.pageSize,
        query: '',
        dataplaneType: 'all',
        s: '',
        mesh: '',
        dataPlane: '',
      }"
    >
      <DataSource
        v-slot="{ data, error }: DataplaneOverviewCollectionSource"
        :src="`/meshes/${route.params.mesh}/dataplanes/of/${route.params.dataplaneType}?page=${route.params.page}&size=${route.params.size}&search=${route.params.s}`"
      >
        <AppView>
          <template #title>
            <h2>
              <RouteTitle
                :title="t('data-planes.routes.items.title')"
              />
            </h2>
          </template>

          <KCard>
            <ErrorBlock
              v-if="error !== undefined"
              :error="error"
            />

            <AppCollection
              v-else
              class="data-plane-collection"
              data-testid="data-plane-collection"
              :page-number="route.params.page"
              :page-size="route.params.size"
              :headers="[
                { label: 'Name', key: 'name' },
                { label: 'Type', key: 'type' },
                { label: 'Services', key: 'services' },
                ...(can('use zones') ? [{ label: 'Zone', key: 'zone' }] : []),
                { label: 'Certificate Info', key: 'certificate' },
                { label: 'Status', key: 'status' },
                { label: 'Warnings', key: 'warnings', hideLabel: true },
                { label: 'Details', key: 'details', hideLabel: true },
              ]"
              :items="data?.items"
              :total="data?.total"
              :error="error"
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
                  :placeholder="`tag: 'kuma.io/service: backend'`"
                  :query="route.params.query"
                  :fields="{
                    name: { description: 'filter by name or parts of a name' },
                    protocol: { description: 'filter by “kuma.io/protocol” value' },
                    service: { description: 'filter by “kuma.io/service” value' },
                    tag: { description: 'filter by tags (e.g. “tag: version:2”)' },
                    ...(can('use zones') && { zone: { description: 'filter by “kuma.io/zone” value' } }),
                  }"
                  @fields-change="route.update({
                    query: $event.query,
                    s: $event.query.length > 0 ? JSON.stringify($event.fields) : '',
                  })"
                />

                <KSelect
                  class="filter-select"
                  label="Type"
                  :items="['all', 'standard', 'builtin', 'delegated'].map((value) => ({
                    value,
                    label: t(`data-planes.type.${value}`),
                    selected: value === route.params.dataplaneType,
                  }))"
                  @selected="route.update({ dataplaneType: String($event.value) })"
                >
                  <template #item-template="{ item: value }">
                    {{ value.label }}
                  </template>
                </KSelect>
              </template>

              <template #name="{ row }">
                <RouterLink
                  class="name-link"
                  :title="row.name"
                  :to="{
                    name: 'data-plane-summary-view',
                    params: {
                      mesh: row.mesh,
                      dataPlane: row.name,
                    },
                    query: {
                      page: route.params.page,
                      size: route.params.size,
                      query: route.params.query,
                      dataplaneType: route.params.dataplaneType,
                    },
                  }"
                >
                  {{ row.name }}
                </RouterLink>
              </template>

              <template #type="{ row }">
                {{ t(`data-planes.type.${row.dataplaneType}`) }}
              </template>

              <template #services="{ row }">
                <KTruncate
                  v-if="row.services.length > 0"
                  width="auto"
                >
                  <div
                    v-for="(service, index) in row.services"
                    :key="index"
                  >
                    <TextWithCopyButton :text="service">
                      <RouterLink
                        v-if="row.dataplaneType === 'standard'"
                        :to="{
                          name: 'service-detail-view',
                          params: {
                            service,
                          },
                        }"
                      >
                        {{ service }}
                      </RouterLink>

                      <RouterLink
                        v-else-if="row.dataplaneType === 'delegated' && can('use gateways ui')"
                        :to="{
                          name: 'delegated-gateway-detail-view',
                          params: {
                            service,
                          },
                        }"
                      >
                        {{ service }}
                      </RouterLink>

                      <template v-else>
                        {{ service }}
                      </template>
                    </TextWithCopyButton>
                  </div>
                </KTruncate>

                <template v-else>
                  {{ t('common.collection.none') }}
                </template>
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
                <KTooltip v-if="row.isCertExpired || row.warnings.length > 0">
                  <template #content>
                    <ul>
                      <template v-if="row.warnings.length > 0">
                        <li>{{ t('data-planes.components.data-plane-list.version_mismatch') }}</li>
                      </template>

                      <template v-if="row.isCertExpired">
                        <li>{{ t('data-planes.components.data-plane-list.cert_expired') }}</li>
                      </template>
                    </ul>
                  </template>

                  <WarningIcon
                    class="mr-1"
                    :size="KUI_ICON_SIZE_30"
                    hide-title
                  />
                </KTooltip>

                <template v-else>
                  {{ t('common.collection.none') }}
                </template>
              </template>

              <template #details="{ row }">
                <RouterLink
                  class="details-link"
                  data-testid="details-link"
                  :to="{
                    name: 'data-plane-detail-view',
                    params: {
                      dataPlane: row.name,
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
                  },
                })"
              >
                <component
                  :is="child.Component"
                  :name="route.params.dataPlane"
                  :dataplane-overview="data?.items.find((item) => item.name === route.params.dataPlane)"
                />
              </SummaryView>
            </RouterView>
          </KCard>
        </AppView>
      </DataSource>
    </RouteView>
  </DataSource>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { ArrowRightIcon } from '@kong/icons'

import type { DataplaneOverviewCollectionSource } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import FilterBar from '@/app/common/filter-bar/FilterBar.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import WarningIcon from '@/app/common/WarningIcon.vue'
import type { MeSource } from '@/app/me/sources'
</script>

<style lang="scss" scoped>
.data-plane-proxy-filter {
  flex-basis: 350px;
  flex-grow: 1;
}

.filter-select {
  flex-basis: 205px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: $kui-space-40;
}

.filter-select :deep(.k-label) {
  // Removes the bottom margin as we’re aligning the label with the select in a horizontal layout.
  margin-bottom: 0 !important;
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
