<template>
  <RouteView
    v-slot="{ route }"
    name="zone-cp-list-view"
  >
    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'zone-cp-list-view',
          },
          text: t('zone-cps.routes.items.breadcrumbs')
        },
      ]"
    >
      <template #title>
        <h2>
          <RouteTitle
            :title="t('zone-cps.routes.items.title')"
            :render="true"
          />
        </h2>
      </template>

      <MultizoneInfo v-if="store.getters['config/getMulticlusterStatus'] === false" />

      <template v-else>
        <DataSource
          v-slot="{ data, error, refresh }: ZoneOverviewCollectionSource"
          :src="`/zone-cps?size=${props.size}&page=${props.page}`"
        >
          <KCard>
            <template #body>
              <AppCollection
                class="zone-cp-table"
                data-testid="zone-cp-collection"
                :headers="[
                  { label: 'Name', key: 'name' },
                  { label: 'Zone CP Version', key: 'zoneCpVersion' },
                  { label: 'Storage type', key: 'storeType' },
                  { label: 'Status', key: 'status' },
                  { label: 'Warnings', key: 'warnings', hideLabel: true },
                  { label: 'Actions', key: 'actions', hideLabel: true },
                ]"
                :page-number="props.page"
                :page-size="props.size"
                :total="data?.total"
                :items="data ? transformToTableData(data.items) : []"
                :error="error"
                @change="route.update"
              >
                <template
                  v-if="env('KUMA_ZONE_CREATION_FLOW') === 'enabled'"
                  #toolbar
                >
                  <KButton
                    appearance="creation"
                    icon="plus"
                    :to="{ name: 'zone-create-view' }"
                  >
                    Create Zone
                  </KButton>
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
                            color="var(--black-400)"
                            icon="more"
                            size="16"
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
                        v-if="env('KUMA_ZONE_CREATION_FLOW') === 'enabled'"
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

                <template #name="{ row }">
                  <RouterLink
                    :to="row.detailViewRoute"
                    data-testid="detail-view-link"
                  >
                    {{ row.name }}
                  </RouterLink>
                </template>

                <template #status="{ row }">
                  <StatusBadge
                    v-if="row.status"
                    :status="row.status"
                  />

                  <template v-else>
                    —
                  </template>
                </template>

                <template #warnings="{ row }">
                  <KIcon
                    v-if="row.withWarnings"
                    class="mr-1"
                    icon="warning"
                    color="var(--black-500)"
                    secondary-color="var(--yellow-300)"
                    size="20"
                  />
                </template>
              </AppCollection>
            </template>
          </KCard>

          <DeleteResourceModal
            v-if="isDeleteModalVisible"
            :confirmation-text="deleteZoneName"
            :delete-function="deleteZone"
            :is-visible="isDeleteModalVisible"
            modal-id="delete-zone-modal"
            :action-button-text="t('zones.delete.confirmModal.proceedText')"
            :title="t('zones.delete.confirmModal.title')"
            @cancel="toggleDeleteModal"
            @delete="refresh"
          >
            <template #body-content>
              <p>{{ t('zones.delete.confirmModal.text1', { zoneName: deleteZoneName }) }}</p>

              <p>{{ t('zones.delete.confirmModal.text2') }}</p>
            </template>

            <template #error>
              {{ t('zones.delete.confirmModal.errorText') }}
            </template>
          </DeleteResourceModal>
        </DataSource>
      </template>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { KButton, KCard, KDropdownItem, KDropdownMenu, KIcon } from '@kong/kongponents'
import { ref } from 'vue'
import { type RouteLocationNamedRaw } from 'vue-router'

import MultizoneInfo from '../components/MultizoneInfo.vue'
import type { ZoneOverviewCollectionSource } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import AppView from '@/app/application/components/app-view/AppView.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import DeleteResourceModal from '@/app/common/DeleteResourceModal.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import { useStore } from '@/store/store'
import { StatusKeyword, ZoneOverview } from '@/types/index.d'
import { useEnv, useI18n, useKumaApi } from '@/utilities'
import { getItemStatusFromInsight } from '@/utilities/dataplane'

type ZoneOverviewTableRow = {
  detailViewRoute: RouteLocationNamedRaw
  name: string
  status: StatusKeyword
  zoneCpVersion: string
  storeType: string
  withWarnings: boolean
}

const env = useEnv()
const { t } = useI18n()
const kumaApi = useKumaApi()
const store = useStore()

const props = defineProps({
  page: {
    type: Number,
    required: true,
  },

  size: {
    type: Number,
    required: true,
  },
})

const isDeleteModalVisible = ref(false)
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
    let zoneCpVersion = '-'
    let storeType = ''
    let cpCompat = true

    const subscriptions = zoneOverview.zoneInsight?.subscriptions ?? []

    subscriptions.forEach((item: any) => {
      if (item.version && item.version.kumaCp) {
        zoneCpVersion = item.version.kumaCp.version
        const { kumaCpGlobalCompatible = true } = item.version.kumaCp

        cpCompat = kumaCpGlobalCompatible
        if (item.config) {
          storeType = JSON.parse(item.config).store.type
        }
      }
    })

    const status = getItemStatusFromInsight(zoneOverview.zoneInsight)

    return {
      detailViewRoute,
      name,
      status,
      zoneCpVersion,
      storeType,
      withWarnings: !cpCompat,
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
</script>

<style lang="scss" scoped>
.actions-dropdown {
  display: inline-block;
}
</style>

<style lang="scss">
.zone-cp-collection {
  .warnings-column,
  .actions-column {
    width: 5%;
    min-width: 80px;
    text-align: end;
  }

  .status-column {
    width: 10%;
    min-width: 200px;
  }
}
</style>
