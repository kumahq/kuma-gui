<template>
  <RouteView
    name="service-detail-view"
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
          <XAboutSection
            :title="t('services.internal-service.about.title')"
            :created="data.creationTime ? t('common.formats.datetime', { value: Date.parse(data.creationTime) }) : undefined"
            :modified="data.modificationTime ? t('common.formats.datetime', { value: Date.parse(data.modificationTime)}) : undefined"
          >
            <DefinitionCard layout="horizontal">
              <template #title>
                {{ t('http.api.property.status') }}:
              </template>

              <template #body>
                <StatusBadge :status="data.status" />
              </template>
            </DefinitionCard>

            <DefinitionCard layout="horizontal">
              <template #title>
                {{ t('http.api.property.address') }}:
              </template>

              <template #body>
                <template v-if="data.addressPort">
                  <XBadge appearance="decorative">
                    <TextWithCopyButton
                      :text="data.addressPort"
                    />
                  </XBadge>
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
                {{ t('http.api.property.dataPlaneProxies') }}:
              </template>
            </ResourceStatus>
          </XAboutSection>
        </DataLoader>

        <div>
          <h3>
            {{ t('services.detail.data_plane_proxies') }}
          </h3>

          <KCard
            class="mt-4"
          >
            <search>
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
            >
              <template
                #loadable="{ data }"
              >
                <DataCollection
                  type="data-planes"
                  :items="data?.items ?? [undefined]"
                  :page="route.params.page"
                  :page-size="route.params.size"
                  :total="data?.total"
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
                    :items="data?.items"
                    :is-selected-row="(row) => row.name === route.params.dataPlane"
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
              </template>
            </DataLoader>
          </KCard>
        </div>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import FilterBar from '@/app/common/filter-bar/FilterBar.vue'
import ResourceStatus from '@/app/common/ResourceStatus.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
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
