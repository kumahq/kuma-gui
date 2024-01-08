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
        size: me.pageSize,
        zone: '',
      }"
    >
      <AppView>
        <template #title>
          <h1>
            <RouteTitle
              :title="t('zone-cps.routes.items.title')"
            />
          </h1>
        </template>

        <template
          v-if="can('create zones') && isCreateZoneButtonVisible"
          #actions
        >
          <KButton
            appearance="primary"
            :to="{ name: 'zone-create-view' }"
            data-testid="create-zone-link"
          >
            <AddIcon :size="KUI_ICON_SIZE_30" />

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
                { label: 'Status', key: 'state' },
                { label: 'Warnings', key: 'warnings', hideLabel: true },
                { label: 'Details', key: 'details', hideLabel: true },
                { label: 'Actions', key: 'actions', hideLabel: true },
              ]"
              :page-number="route.params.page"
              :page-size="route.params.size"
              :total="data?.total"
              :items="data?.items"
              :error="error"
              :empty-state-title="can('create zones') ? t('zone-cps.empty_state.title') : undefined"
              :empty-state-message="can('create zones') ? t('zone-cps.empty_state.message') : undefined"
              :empty-state-cta-to="can('create zones') ? { name: 'zone-create-view' } : undefined"
              :empty-state-cta-text="can('create zones') ? t('zones.index.create') : undefined"
              :is-selected-row="(row) => row.name === route.params.zone"
              @change="route.update"
            >
              <template #name="{ row: item }">
                <RouterLink
                  :to="{
                    name: 'zone-cp-detail-view',
                    params: {
                      zone: item.name,
                    },
                    query: {
                      page: route.params.page,
                      size: route.params.size,
                    },
                  }"
                >
                  {{ item.name }}
                </RouterLink>
              </template>

              <template #zoneCpVersion="{ row: item }">
                {{ get(item.zoneInsight, 'version.kumaCp.version', t('common.collection.none')) }}
              </template>

              <template #type="{ row: item }">
                {{ item.zoneInsight.environment.length > 0 ? item.zoneInsight.environment : 'kubernetes' }}
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

              <template #state="{ row: item }">
                <StatusBadge
                  :status="item.state"
                />
              </template>

              <template #warnings="{ row: item }">
                <template
                  v-for="warnings in [{
                    version_mismatch: !get(item.zoneInsight, 'version.kumaCp.kumaCpGlobalCompatible', 'true'),
                    store_memory: item.zoneInsight.store === 'memory',
                  }]"
                  :key="`${warnings.version_mismatch}-${warnings.store_memory}`"
                >
                  <KTooltip
                    v-if="Object.values(warnings).some((item) => item)"
                  >
                    <template
                      #content
                    >
                      <ul>
                        <template
                          v-for="(warning, i) in warnings"
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
              </template>

              <template #details="{ row }">
                <RouterLink
                  class="details-link"
                  data-testid="details-link"
                  :to="{
                    name: 'zone-cp-detail-view',
                    params: {
                      zone: row.name,
                    },
                  }"
                >
                  {{ t('common.collection.details_link') }}

                  <ArrowRightIcon
                    display="inline-block"
                    decorative
                    :size="KUI_ICON_SIZE_30"
                  />
                </RouterLink>
              </template>

              <template
                v-if="can('create zones')"
                #actions="{ row }"
              >
                <KDropdown
                  class="actions-dropdown"
                  :kpop-attributes="{ placement: 'bottomEnd', popoverClasses: 'mt-5 more-actions-popover' }"
                  width="150"
                >
                  <template #default>
                    <KButton
                      class="non-visual-button"
                      appearance="secondary"
                      icon-only
                    >
                      <MoreIcon />
                    </KButton>
                  </template>

                  <template #items>
                    <KDropdownItem
                      has-divider
                      danger
                      data-testid="dropdown-delete-item"
                      @click="setDeleteZoneName(row.name)"
                    >
                      {{ t('common.collection.actions.delete') }}
                    </KDropdownItem>
                  </template>
                </KDropdown>
              </template>
            </AppCollection>
          </KCard>

          <RouterView
            v-if="route.params.zone"
            v-slot="child"
          >
            <SummaryView
              @close="route.replace({
                name: 'zone-cp-list-view',
                query: {
                  page: route.params.page,
                  size: route.params.size,
                },
              })"
            >
              <component
                :is="child.Component"
                :name="route.params.zone"
                :zone-overview="data?.items.find((item) => item.name === route.params.zone)"
              />
            </SummaryView>
          </RouterView>

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
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { AddIcon, ArrowRightIcon, MoreIcon } from '@kong/icons'
import { ref } from 'vue'

import type { ZoneOverviewCollectionSource } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import DeleteResourceModal from '@/app/common/DeleteResourceModal.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import WarningIcon from '@/app/common/WarningIcon.vue'
import type { MeSource } from '@/app/me/sources'
import type { ZoneEgressOverview } from '@/app/zone-egresses/data'
import type { ZoneIngressOverview } from '@/app/zone-ingresses/data'
import type { DiscoverySubscription } from '@/types/index.d'
import { useKumaApi } from '@/utilities'
import { get } from '@/utilities/get'

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
.details-link {
  display: inline-flex;
  align-items: center;
  gap: $kui-space-20;
}

.actions-dropdown {
  display: inline-block;
}

.warning-type-memory {
  margin-top: $kui-space-60;
  margin-bottom: $kui-space-60;
}
</style>
