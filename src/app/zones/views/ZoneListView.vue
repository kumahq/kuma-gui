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

        <MultizoneInfo v-if="!can('use zones')" />

        <template v-else>
          <DataSource
            v-slot="{ data, error, refresh }: ZoneOverviewCollectionSource"
            :src="`/zone-cps?page=${route.params.page}&size=${route.params.size}`"
            @change="setIsCreateZoneButtonVisible"
          >
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

                  <template #status="{ rowValue }">
                    <StatusBadge
                      v-if="rowValue"
                      :status="rowValue"
                    />

                    <template v-else>
                      {{ t('common.collection.none') }}
                    </template>
                  </template>

                  <template #warnings="{ rowValue }">
                    <KTooltip
                      v-if="rowValue"
                      :label="t('zone-cps.list.version_mismatch')"
                    >
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
        </template>
      </AppView>
    </RouteView>
  </DataSource>
</template>

<script lang="ts" setup>
import { KUI_COLOR_TEXT_NEUTRAL_STRONGER, KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { KButton, KCard, KDropdownItem, KDropdownMenu, KIcon, KTooltip } from '@kong/kongponents'
import { ref } from 'vue'
import { type RouteLocationNamedRaw } from 'vue-router'

import MultizoneInfo from '../components/MultizoneInfo.vue'
import { getZoneControlPlaneStatus } from '../getZoneControlPlaneStatus'
import type { ZoneOverviewCollectionSource } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import DeleteResourceModal from '@/app/common/DeleteResourceModal.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import WarningIcon from '@/app/common/WarningIcon.vue'
import type { MeSource } from '@/app/me/sources'
import { StatusKeyword, ZoneOverview } from '@/types/index.d'
import { useKumaApi } from '@/utilities'

type ZoneOverviewTableRow = {
  detailViewRoute: RouteLocationNamedRaw
  name: string
  status: StatusKeyword | 'disabled'
  zoneCpVersion: string
  type: string
  warnings: boolean
}

const kumaApi = useKumaApi()

const isDeleteModalVisible = ref(false)
const isCreateZoneButtonVisible = ref(false)
const deleteZoneName = ref('')

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
    let cpCompat = true

    const subscriptions = zoneOverview.zoneInsight?.subscriptions ?? []

    subscriptions.forEach((item) => {
      if (item.version && item.version.kumaCp) {
        zoneCpVersion = item.version.kumaCp.version
        const { kumaCpGlobalCompatible = true } = item.version.kumaCp

        cpCompat = kumaCpGlobalCompatible
      }

      if (item.config) {
        type = JSON.parse(item.config).environment
      }
    })

    const status = getZoneControlPlaneStatus(zoneOverview)

    return {
      detailViewRoute,
      name,
      status,
      zoneCpVersion,
      type,
      warnings: !cpCompat,
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
</style>
