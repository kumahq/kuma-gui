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

        <DataSource
          v-slot="{ data, error, refresh }: ZoneOverviewCollectionSource"
          :src="`/zone-cps?page=${route.params.page}&size=${route.params.size}`"
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
            <template
              v-else
            >
              <XTeleportTemplate
                v-if="can('create zones') && (data?.items ?? []).length > 0"
                :to="{ name: 'zone-cp-list-view-actions'}"
              >
                <KButton
                  appearance="primary"
                  :to="{ name: 'zone-create-view' }"
                  data-testid="create-zone-link"
                >
                  <AddIcon />

                  {{ t('zones.index.create') }}
                </KButton>
              </XTeleportTemplate>

              <AppCollection
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
                    <XIcon
                      v-if="Object.values(warnings).some((item) => item)"
                      name="warning"
                      data-testid="warning"
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
                    </XIcon>
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
                      <XDisclosure
                        v-slot="{ expanded, toggle }"
                      >
                        <KDropdownItem
                          danger
                          data-testid="dropdown-delete-item"
                          @click="toggle"
                        >
                          {{ t('common.collection.actions.delete') }}
                        </KDropdownItem>
                        <XTeleportTemplate
                          :to="{ name: 'modal-layer' }"
                        >
                          <DeleteResourceModal
                            v-if="expanded"
                            :confirmation-text="row.name"
                            :delete-function="() => deleteZone(row.name)"
                            is-visible
                            :action-button-text="t('common.delete_modal.proceed_button')"
                            :title="t('common.delete_modal.title', { type: 'Zone' })"
                            data-testid="delete-zone-modal"
                            @cancel="toggle"
                            @delete="() => { toggle(); refresh() }"
                          >
                            <p>{{ t('common.delete_modal.text1', { type: 'Zone', name: row.name }) }}</p>

                            <p>{{ t('common.delete_modal.text2') }}</p>
                          </DeleteResourceModal>
                        </XTeleportTemplate>
                      </XDisclosure>
                    </template>
                  </KDropdown>
                </template>
              </AppCollection>
            </template>
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
import type { MeSource } from '@/app/me/sources'
import type { ZoneEgressOverview } from '@/app/zone-egresses/data'
import type { ZoneIngressOverview } from '@/app/zone-ingresses/data'
import { useKumaApi } from '@/utilities'
import { get } from '@/utilities/get'

const kumaApi = useKumaApi()

type ZoneProxies<T> = Record<string, {online: T[], offline: T[]}>
const ingresses = ref<ZoneProxies<ZoneIngressOverview>>({})
const egresses = ref<ZoneProxies<ZoneEgressOverview>>({})

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
      const state = typeof item[`${prop}Insight`].connectedSubscription !== 'undefined' ? 'online' : 'offline'
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
      const state = typeof item[`${prop}Insight`].connectedSubscription !== 'undefined' ? 'online' : 'offline'
      prev[name][state].push(item)
    }
    return prev
  }, {} as ZoneProxies<ZoneEgressOverview>)
}

async function deleteZone(name: string) {
  // Intentionally not wrapped in a try-catch block so that the DeleteResourceModal can discover when the operation failed.
  await kumaApi.deleteZone({ name })
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
