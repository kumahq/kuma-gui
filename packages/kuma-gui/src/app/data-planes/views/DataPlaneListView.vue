<template>
  <RouteView
    name="data-plane-list-view"
    :params="{
      page: 1,
      size: Number,
      dataplaneType: 'all',
      s: '',
      mesh: '',
      proxy: '',
    }"
    v-slot="{ can, route, t, me, uri }"
  >
    <RouteTitle
      :render="false"
      :title="t('data-planes.routes.items.title')"
    />
    <AppView
      :docs="t('data-planes.href.docs.data_plane_proxy')"
    >
      <XI18n
        path="data-planes.routes.items.intro"
        default-path="common.i18n.ignore-error"
      />
      <XCard>
        <search>
          <form
            class="search-form"
            @submit.prevent
          >
            <XSearch
              class="search-field"
              placeholder="Filter by name, label, zone or namespace..."
              :value="route.params.s"
              @change="(s) => route.update({ page: 1, s })"
            />
            
            <XSelect
              label="Type"
              name="dataplaneType"
              :selected="route.params.dataplaneType"
              @change="(value: string) => route.update({ page: 1, dataplaneType: value })"
            >
              <template #selected="{ item }: { item: 'all' | 'standard' | 'builtin' | 'delegated'}">
                <XIcon
                  v-if="item !== 'all'"
                  :size="KUI_ICON_SIZE_40"
                  :name="item"
                />
                {{ t(`data-planes.type.${item}`) }}
              </template>
              <template
                v-for="item in (['all', 'standard', 'builtin', 'delegated'] as const)"
                :key="item"
                #[`${item}-option`]
              >
                <XIcon
                  v-if="item !== 'all'"
                  :name="item"
                />
                {{ t(`data-planes.type.${item}`) }}
              </template>
            </XSelect>
          </form>
        </search>
        <DataLoader
          :src="uri(sources, `/meshes/:mesh/dataplanes/of/:type`, {
            mesh: route.params.mesh,
            type: route.params.dataplaneType,
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
              :total="data?.total"
              :page="route.params.page"
              :page-size="route.params.size"
              @change="route.update"
            >
              <AppCollection
                class="data-plane-collection"
                data-testid="data-plane-collection"
                :headers="[
                  { ...me.get('headers.type'), label: '&nbsp;', key: 'type' },
                  { ...me.get('headers.name'), label: 'Name', key: 'name' },
                  { ...me.get('headers.namespace'), label: 'Namespace', key: 'namespace' },
                  ...(can('use zones') ? [{ ...me.get('headers.zone'), label: 'Zone', key: 'zone' }] : []),
                  ...(can('use service-insights', props.mesh) ? [{ ...me.get('headers.services'), label: 'Services', key: 'services' }] : []),
                  { ...me.get('headers.certificate'), label: 'Certificate Info', key: 'certificate' },
                  { ...me.get('headers.status'), label: 'Status', key: 'status' },
                  { ...me.get('headers.warnings'), label: 'Warnings', key: 'warnings', hideLabel: true },
                  { ...me.get('headers.actions'), label: 'Actions', key: 'actions', hideLabel: true },
                ]"
                :items="data?.items"
                :is-selected-row="(row) => row.name === route.params.proxy"
                @resize="me.set"
              >
                <template #type="{ row: item }">
                  <XIcon :name="item.dataplaneType">
                    {{ t(`data-planes.type.${item.dataplaneType}`) }}
                  </XIcon>
                </template>

                <template #name="{ row: item }">
                  <XAction
                    data-action
                    class="name-link"
                    :title="item.name"
                    :to="{
                      name: 'data-plane-summary-view',
                      params: {
                        mesh: item.mesh,
                        proxy: item.id,
                      },
                      query: {
                        page: route.params.page,
                        size: route.params.size,
                        s: route.params.s,
                        dataplaneType: route.params.dataplaneType,
                      },
                    }"
                  >
                    {{ item.name }}
                  </XAction>
                </template>

                <template #namespace="{ row: item }">
                  {{ item.namespace }}
                </template>

                <template #services="{ row }">
                  <XLayout
                    v-if="row.services.length > 0"
                    type="separated"
                    truncate
                  >
                    <div
                      v-for="(service, index) in row.services"
                      :key="index"
                    >
                      <XCopyButton :text="service">
                        <XAction
                          v-if="row.dataplaneType === 'standard'"
                          :to="{
                            name: 'service-detail-view',
                            params: {
                              service,
                            },
                          }"
                        >
                          {{ service }}
                        </XAction>

                        <XAction
                          v-else-if="row.dataplaneType === 'delegated'"
                          :to="{
                            name: 'delegated-gateway-detail-view',
                            params: {
                              service,
                            },
                          }"
                        >
                          {{ service }}
                        </XAction>

                        <template v-else>
                          {{ service }}
                        </template>
                      </XCopyButton>
                    </div>
                  </XLayout>

                  <template v-else>
                    {{ t('common.collection.none') }}
                  </template>
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
                  <StatusBadge
                    :status="row.status"
                  />
                </template>

                <template #warnings="{ row : item }">
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
      </XCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_40 } from '@kong/design-tokens'

import { sources } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import type { Mesh } from '@/app/meshes/data'

const props = defineProps<{
  mesh: Mesh
}>()
</script>

<style lang="scss" scoped>
.app-collection:deep(:is(th, td):nth-child(1)) {
  padding-left: 8px !important;
  padding-right: 0 !important;
  width: 16px !important;
}
.app-collection :deep(td:nth-child(2) a) {
  color: inherit;
  font-weight: $kui-font-weight-semibold;
  text-decoration: none;
}

search {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: stretch;
  flex-wrap: wrap;
  margin-bottom: $kui-space-70;
}

.search-form {
  display: flex;
  width: 100%;
  gap: $kui-space-70;
}

.search-field {
  flex-basis: 310px;
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
