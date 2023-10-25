<template>
  <DataSource
    v-slot="{ data: me }: MeSource"
    src="/me"
  >
    <RouteView
      v-if="me"
      v-slot="{ route, t, can }"
      name="zone-cp-list-view"
      :params="{
        page: 1,
        size: me.pageSize
      }"
    >
      <AppView>
        <template #title>
          <h1>
            <RouteTitle
              :title="t('zone-cps.routes.items.title')"
              :render="true"
            />
          </h1>
        </template>

        <template
          v-if="can('create zones') && isCreateZoneButtonVisible"
          #actions
        >
          <KButton
            appearance="primary"
            icon="plus"
            :to="{ name: 'zone-create-view' }"
            data-testid="create-zone-link"
          >
            {{ t('zones.index.create') }}
          </KButton>
        </template>

        <DataSource
          v-slot="{ data, error, refresh }: ZoneOverviewCollectionSource"
          :src="`/zone-cps?page=${route.params.page}&size=${route.params.size}`"
          @change="setIsCreateZoneButtonVisible"
        >
          <DataSource
            :src="`/zone-ingress-overviews?page=1&size=100`"
            @change="getIngresses"
          />
          <DataSource
            :src="`/zone-egress-overviews?page=1&size=100`"
            @change="getEgresses"
          />
          <KCard>
            <template #body>
              <ErrorBlock
                v-if="error !== undefined"
                :error="error"
              />

              <AppCollection
                v-else
                class="zone-cp-collection"
                data-testid="zone-cp-collection"
                :headers="[
                  { label: 'Name', key: 'name' },
                  { label: 'Zone CP Version', key: 'zoneCpVersion' },
                  { label: 'Type', key: 'type' },
                  { label: 'Ingresses (online / total)', key: 'ingress' },
                  { label: 'Egresses (online / total)', key: 'egress' },
                  { label: 'Status', key: 'status' },
                  { label: 'Warnings', key: 'warnings', hideLabel: true },
                  { label: 'Actions', key: 'actions', hideLabel: true },
                ]"
                :page-number="parseInt(route.params.page)"
                :page-size="parseInt(route.params.size)"
                :total="data?.total"
                :items="data ? transformToTableData(data.items) : undefined"
                :error="error"
                :empty-state-title="can('create zones') ? t('zone-cps.empty_state.title') : undefined"
                :empty-state-message="can('create zones') ? t('zone-cps.empty_state.message') : undefined"
                :empty-state-cta-to="can('create zones') ? { name: 'zone-create-view' } : undefined"
                :empty-state-cta-text="can('create zones') ? t('zones.index.create') : undefined"
                @change="route.update"
              >
                <template #name="{ row, rowValue }">
                  <RouterLink
                    :to="row.detailViewRoute"
                    data-testid="detail-view-link"
                  >
                    {{ rowValue }}
                  </RouterLink>
                </template>

                <template #zoneCpVersion="{ rowValue }">
                  {{ rowValue || t('common.collection.none') }}
                </template>

                <template #type="{ rowValue }">
                  {{ rowValue || t('common.collection.none') }}
                </template>

                <template #ingress="{ row: item }">
                  <template
                    v-for="proxies in [ingresses[item.name] || {online: [], offline: []}]"
                  >
                    {{ proxies.online.length }} / {{ proxies.online.length + proxies.offline.length }}
                  </template>
                </template>

                <template #egress="{ row: item }">
                  <template
                    v-for="proxies in [egresses[item.name] || {online: [], offline: []}]"
                  >
                    {{ proxies.online.length }} / {{ proxies.online.length + proxies.offline.length }}
                  </template>
                </template>

                <template #status="{ rowValue }">
                  <StatusBadge
                    v-if="rowValue"
                    :status="rowValue"
                  />

                  <template v-else>
                    {{ t('common.collection.none') }}
                  </template>
                </template>

                <template #warnings="{ row: item }">
                  <KTooltip
                    v-if="Object.values(item.warnings).some((item) => item)"
                  >
                    <template
                      #content
                    >
                      <ul>
                        <template
                          v-for="(warning, i) in item.warnings"
                          :key="i"
                        >
                          <li
                            v-if="warning"
                            :data-testid="`warning-${i}`"
                          >
                            {{ t(`zone-cps.list.${i}`) }}
                          </li>
                        </template>
                      </ul>
                    </template>
                    <WarningIcon
                      data-testid="warning"
                      class="mr-1"
                      :size="KUI_ICON_SIZE_30"
                      hide-title
                    />
                  </KTooltip>

                  <template v-else>
                    {{ t('common.collection.none') }}
                  </template>
                </template>

                <template #actions="{ row }">
                  <KDropdownMenu
                    class="actions-dropdown"
                    data-testid="actions-dropdown"
                    :kpop-attributes="{ placement: 'bottomEnd', popoverClasses: 'mt-5 more-actions-popover' }"
                    width="150"
                  >
                    <template #default>
                      <KButton
                        class="non-visual-button"
                        appearance="secondary"
                        size="small"
                      >
                        <template #icon>
                          <KIcon
                            :color="KUI_COLOR_TEXT_NEUTRAL_STRONGER"
                            icon="more"
                            :size="KUI_ICON_SIZE_30"
                          />
                        </template>
                      </KButton>
                    </template>

                    <template #items>
                      <KDropdownItem
                        :item="{
                          to: row.detailViewRoute,
                          label: t('common.collection.actions.view'),
                        }"
                      />

                      <KDropdownItem
                        v-if="can('create zones')"
                        has-divider
                        is-dangerous
                        data-testid="dropdown-delete-item"
                        @click="setDeleteZoneName(row.name)"
                      >
                        {{ t('common.collection.actions.delete') }}
                      </KDropdownItem>
                    </template>
                  </KDropdownMenu>
                </template>
              </AppCollection>
            </template>
          </KCard>

          <DeleteResourceModal
            v-if="isDeleteModalVisible"
            :confirmation-text="deleteZoneName"
            :delete-function="deleteZone"
            is-visible
            :action-button-text="t('common.delete_modal.proceed_button')"
            :title="t('common.delete_modal.title', { type: 'Zone' })"
            data-testid="delete-zone-modal"
            @cancel="toggleDeleteModal"
            @delete="() => { toggleDeleteModal(); refresh() }"
          >
            <template #body-content>
              <p>{{ t('common.delete_modal.text1', { type: 'Zone', name: deleteZoneName }) }}</p>

              <p>{{ t('common.delete_modal.text2') }}</p>
            </template>
          </DeleteResourceModal>
        </DataSource>
      </AppView>
    </RouteView>
  </DataSource>
</template>

<script lang="ts" setup>
import { KUI_COLOR_TEXT_NEUTRAL_STRONGER, KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { KButton, KCard, KDropdownItem, KDropdownMenu, KIcon, KTooltip } from '@kong/kongponents'
import { ref } from 'vue'
import { type RouteLocationNamedRaw } from 'vue-router'

import { getZoneControlPlaneStatus } from '../data'
import type { ZoneOverviewCollectionSource } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import DeleteResourceModal from '@/app/common/DeleteResourceModal.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import WarningIcon from '@/app/common/WarningIcon.vue'
import type { MeSource } from '@/app/me/sources'
import type { DiscoverySubscription, StatusKeyword, ZoneEgressOverview, ZoneIngressOverview, ZoneOverview } from '@/types/index.d'
import { useKumaApi } from '@/utilities'

type ZoneOverviewTableRow = {
  detailViewRoute: RouteLocationNamedRaw
  name: string
  status: StatusKeyword | 'disabled'
  zoneCpVersion: string
  type: string
  warnings: {
    version_mismatch: boolean
    store_memory: boolean
  }
}

const kumaApi = useKumaApi()

const isDeleteModalVisible = ref(false)
const isCreateZoneButtonVisible = ref(false)
const deleteZoneName = ref('')

type ZoneProxies<T> = Record<string, {online: T[], offline: T[]}>
const ingresses = ref<ZoneProxies<ZoneIngressOverview>>({})
const egresses = ref<ZoneProxies<ZoneEgressOverview>>({})

const getState = (subscriptions: DiscoverySubscription[]) => {
  let state: 'online' | 'offline' = 'offline'
  if (subscriptions.length > 0) {
    state = 'online'
    const lastSubscription = subscriptions[subscriptions.length - 1]
    if (typeof lastSubscription.disconnectTime !== 'undefined') {
      state = 'offline'
    }
  }
  return state
}

const getIngresses = (data: {items: ZoneIngressOverview[]}) => {
  const prop = 'zoneIngress'
  ingresses.value = data.items.reduce((prev, item) => {
    const name = item[prop]?.zone
    if (typeof name !== 'undefined') {
      if (typeof prev[name] === 'undefined') {
        prev[name] = {
          online: [],
          offline: [],
        }
      }
      const subscriptions = item[`${prop}Insight`]?.subscriptions || []
      const state = getState(subscriptions)
      prev[name][state].push(item)
    }
    return prev
  }, {} as ZoneProxies<ZoneIngressOverview>)
}
const getEgresses = (data: {items: ZoneEgressOverview[]}) => {
  const prop = 'zoneEgress'
  egresses.value = data.items.reduce((prev, item) => {
    const name = item[prop]?.zone
    if (typeof name !== 'undefined') {
      if (typeof prev[name] === 'undefined') {
        prev[name] = {
          online: [],
          offline: [],
        }
      }
      const subscriptions = item[`${prop}Insight`]?.subscriptions || []
      const state = getState(subscriptions)
      prev[name][state].push(item)
    }
    return prev
  }, {} as ZoneProxies<ZoneEgressOverview>)
}

function transformToTableData(zoneOverviews: ZoneOverview[]): ZoneOverviewTableRow[] {
  return zoneOverviews.map((zoneOverview) => {
    const { name } = zoneOverview
    const detailViewRoute: RouteLocationNamedRaw = {
      name: 'zone-cp-detail-view',
      params: {
        zone: name,
      },
    }
    let zoneCpVersion = ''
    let type = 'kubernetes'
    let memoryStore = false
    let cpCompat = true

    const subscriptions = zoneOverview.zoneInsight?.subscriptions ?? []

    subscriptions.forEach((item) => {
      if (item.version && item.version.kumaCp) {
        zoneCpVersion = item.version.kumaCp.version
        const { kumaCpGlobalCompatible = true } = item.version.kumaCp

        cpCompat = kumaCpGlobalCompatible
      }

      if (item.config) {
        const data = JSON.parse(item.config)
        type = data.environment
        memoryStore = data.store.type === 'memory'
      }
    })

    const status = getZoneControlPlaneStatus(zoneOverview)

    return {
      detailViewRoute,
      name,
      status,
      zoneCpVersion,
      type,
      warnings: {
        version_mismatch: !cpCompat,
        store_memory: memoryStore,
      },
    }
  })
}

async function deleteZone() {
  // Intentionally not wrapped in a try-catch block so that the DeleteResourceModal can discover when the operation failed.
  await kumaApi.deleteZone({ name: deleteZoneName.value })
}

function toggleDeleteModal() {
  isDeleteModalVisible.value = !isDeleteModalVisible.value
}

function setDeleteZoneName(name: string) {
  toggleDeleteModal()
  deleteZoneName.value = name
}

function setIsCreateZoneButtonVisible(data: any) {
  isCreateZoneButtonVisible.value = data?.items.length > 0
}
</script>

<style lang="scss" scoped>
.actions-dropdown {
  display: inline-block;
}
.warning-type-memory {
  margin-top: $kui-space-60;
  margin-bottom: $kui-space-60;
}
</style>
