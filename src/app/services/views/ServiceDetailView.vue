<template>
  <DataSource
    v-slot="{ data: me }: MeSource"
    src="/me"
  >
    <RouteView
      v-if="me"
      v-slot="{ can, route, t }"
      name="service-detail-view"
      :params="{
        mesh: '',
        service: '',
        page: 1,
        size: me.pageSize,
        query: '',
        s: '',
        dataPlane: '',
        codeSearch: '',
        codeFilter: false,
        codeRegExp: false,
      }"
    >
      <AppView>
        <DataSource
          v-slot="{ data, error }: ServiceInsightSource"
          :src="`/meshes/${route.params.mesh}/service-insights/${route.params.service}`"
        >
          <ErrorBlock
            v-if="error"
            :error="error"
          />

          <LoadingBlock v-else-if="data === undefined" />

          <div
            v-else
            class="stack"
          >
            <KCard>
              <div v-if="!can('use gateways ui') && data.serviceType === 'external'">
                <DataSource
                  v-slot="{ data: externalService, error: externalServiceError }: ExternalServiceSource"
                  :src="`/meshes/${route.params.mesh}/external-services/for/${route.params.service}`"
                >
                  <ErrorBlock
                    v-if="externalServiceError"
                    :error="externalServiceError"
                  />

                  <LoadingBlock v-else-if="externalService === undefined" />

                  <EmptyBlock
                    v-else-if="externalService === null"
                    data-testid="no-matching-external-service"
                  >
                    <template #title>
                      {{ t('services.detail.no_matching_external_service', { name: route.params.service }) }}
                    </template>
                  </EmptyBlock>

                  <div
                    v-else
                    class="columns"
                  >
                    <DefinitionCard>
                      <template #title>
                        {{ t('http.api.property.address') }}
                      </template>

                      <template #body>
                        <TextWithCopyButton :text="externalService.networking.address" />
                      </template>
                    </DefinitionCard>

                    <DefinitionCard v-if="externalService.tags !== null">
                      <template #title>
                        {{ t('http.api.property.tags') }}
                      </template>

                      <template #body>
                        <TagList :tags="externalService.tags" />
                      </template>
                    </DefinitionCard>
                  </div>
                </DataSource>
              </div>

              <div
                v-else
                class="columns"
              >
                <DefinitionCard>
                  <template #title>
                    {{ t('http.api.property.status') }}
                  </template>

                  <template #body>
                    <StatusBadge :status="data.status" />
                  </template>
                </DefinitionCard>

                <DefinitionCard>
                  <template #title>
                    {{ t('http.api.property.address') }}
                  </template>

                  <template #body>
                    <TextWithCopyButton
                      v-if="data.addressPort"
                      :text="data.addressPort"
                    />

                    <template v-else>
                      {{ t('common.detail.none') }}
                    </template>
                  </template>
                </DefinitionCard>

                <ResourceStatus
                  :online="data.dataplanes?.online ?? 0"
                  :total="data.dataplanes?.total ?? 0"
                >
                  <template #title>
                    {{ t('http.api.property.dataPlaneProxies') }}
                  </template>
                </ResourceStatus>
              </div>
            </KCard>

            <div v-if="data.serviceType !== 'external'">
              <h3>{{ t('services.detail.data_plane_proxies') }}</h3>

              <KCard class="mt-4">
                <DataSource
                  v-slot="{ data: dataplanesData, error: dataplanesError }: DataplaneOverviewCollectionSource"
                  :src="`/meshes/${route.params.mesh}/dataplanes/for/${route.params.service}?page=${route.params.page}&size=${route.params.size}&search=${route.params.s}`"
                >
                  <ErrorBlock
                    v-if="dataplanesError !== undefined"
                    :error="dataplanesError"
                  />

                  <AppCollection
                    v-else
                    class="data-plane-collection"
                    data-testid="data-plane-collection"
                    :page-number="route.params.page"
                    :page-size="route.params.size"
                    :headers="[
                      { label: 'Name', key: 'name' },
                      ...(can('use zones') ? [{ label: 'Zone', key: 'zone' }] : []),
                      { label: 'Certificate Info', key: 'certificate' },
                      { label: 'Status', key: 'status' },
                      { label: 'Warnings', key: 'warnings', hideLabel: true },
                      { label: 'Details', key: 'details', hideLabel: true },
                    ]"
                    :items="dataplanesData?.items"
                    :total="dataplanesData?.total"
                    :error="dataplanesError"
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
                        :placeholder="`tag: 'kuma.io/protocol: http'`"
                        :query="route.params.query"
                        :fields="{
                          name: { description: 'filter by name or parts of a name' },
                          protocol: { description: 'filter by “kuma.io/protocol” value' },
                          tag: { description: 'filter by tags (e.g. “tag: version:2”)' },
                          ...(can('use zones') && { zone: { description: 'filter by “kuma.io/zone” value' } }),
                        }"
                        @fields-change="route.update({
                          query: $event.query,
                          s: $event.query.length > 0 ? JSON.stringify($event.fields) : '',
                        })"
                      />
                    </template>

                    <template #name="{ row }">
                      <RouterLink
                        class="name-link"
                        :title="row.name"
                        :to="{
                          name: 'service-data-plane-summary-view',
                          params: {
                            mesh: row.mesh,
                            dataPlane: row.name,
                          },
                          query: {
                            page: route.params.page,
                            size: route.params.size,
                            query: route.params.query,
                          },
                        }"
                      >
                        {{ row.name }}
                      </RouterLink>
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
                        :dataplane-overview="dataplanesData?.items.find((dataplaneOverview) => dataplaneOverview.name === route.params.dataPlane)"
                      />
                    </SummaryView>
                  </RouterView>
                </DataSource>
              </KCard>
            </div>

            <div v-if="data.serviceType === 'external'">
              <h3>{{ t('services.detail.config') }}</h3>

              <div class="mt-4">
                <DataSource
                  v-slot="{ data: externalService, error: externalServiceError }: ExternalServiceSource"
                  :src="`/meshes/${route.params.mesh}/external-services/for/${route.params.service}`"
                >
                  <ErrorBlock
                    v-if="externalServiceError"
                    :error="externalServiceError"
                  />

                  <LoadingBlock v-else-if="externalService === undefined" />

                  <EmptyBlock
                    v-else-if="externalService === null"
                    data-testid="no-matching-external-service"
                  >
                    <template #title>
                      {{ t('services.detail.no_matching_external_service', { name: route.params.service }) }}
                    </template>
                  </EmptyBlock>

                  <ResourceCodeBlock
                    v-else
                    v-slot="{ copy, copying }"
                    data-testid="external-service-config"
                    :resource="externalService.config"
                    is-searchable
                    :query="route.params.codeSearch"
                    :is-filter-mode="route.params.codeFilter"
                    :is-reg-exp-mode="route.params.codeRegExp"
                    @query-change="route.update({ codeSearch: $event })"
                    @filter-mode-change="route.update({ codeFilter: $event })"
                    @reg-exp-mode-change="route.update({ codeRegExp: $event })"
                  >
                    <DataSource
                      v-if="copying"
                      :src="`/meshes/${externalService.mesh}/external-service/${externalService.name}/as/kubernetes?no-store`"
                      @change="(data) => {
                        copy((resolve) => resolve(data))
                      }"
                      @error="(e) => {
                        copy((_resolve, reject) => reject(e))
                      }"
                    />
                  </ResourceCodeBlock>
                </DataSource>
              </div>
            </div>
          </div>
        </DataSource>
      </AppView>
    </RouteView>
  </DataSource>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { ArrowRightIcon } from '@kong/icons'

import type { ServiceInsightSource, ExternalServiceSource } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import ResourceCodeBlock from '@/app/common/code-block/ResourceCodeBlock.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import FilterBar from '@/app/common/filter-bar/FilterBar.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import ResourceStatus from '@/app/common/ResourceStatus.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import TagList from '@/app/common/TagList.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import WarningIcon from '@/app/common/WarningIcon.vue'
import type { DataplaneOverviewCollectionSource } from '@/app/data-planes/sources'
import type { MeSource } from '@/app/me/sources'
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
