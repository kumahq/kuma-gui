<template>
  <RouteView
    v-slot="{ route }"
    name="zone-ingress-list-view"
  >
    <AppView>
      <template #title>
        <h1>
          <RouteTitle
            :title="t('zone-ingresses.routes.items.title')"
            :render="true"
          />
        </h1>
      </template>

      <MultizoneInfo v-if="store.getters['config/getMulticlusterStatus'] === false" />

      <template v-else>
        <DataSource
          v-slot="{ data, error }: ZoneIngressOverviewCollectionSource"
          :src="`/zone-ingresses?size=${props.size}&page=${props.page}`"
        >
          <KCard>
            <template #body>
              <ErrorBlock
                v-if="error !== undefined"
                :error="error"
              />

              <AppCollection
                v-else
                class="zone-ingress-collection"
                data-testid="zone-ingress-collection"
                :headers="[
                  { label: 'Name', key: 'name' },
                  { label: 'Status', key: 'status' },
                  { label: 'Actions', key: 'actions', hideLabel: true },
                ]"
                :page-number="props.page"
                :page-size="props.size"
                :total="data?.total"
                :items="data ? transformToTableData(data.items) : undefined"
                :error="error"
                :empty-state-message="t('common.emptyState.message', { type: 'Zone Ingresses' })"
                :empty-state-cta-to="t('zone-ingresses.href.docs')"
                :empty-state-cta-text="t('common.documentation')"
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

                <template #status="{ rowValue }">
                  <StatusBadge
                    v-if="rowValue"
                    :status="rowValue"
                  />

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
                    </template>
                  </KDropdownMenu>
                </template>
              </AppCollection>
            </template>
          </KCard>
        </DataSource>
      </template>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { KUI_COLOR_TEXT_NEUTRAL_STRONGER, KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { KButton, KCard, KDropdownItem, KDropdownMenu, KIcon } from '@kong/kongponents'
import { RouteLocationNamedRaw } from 'vue-router'

import MultizoneInfo from '../components/MultizoneInfo.vue'
import type { ZoneIngressOverviewCollectionSource } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import AppView from '@/app/application/components/app-view/AppView.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import { useStore } from '@/store/store'
import { StatusKeyword, ZoneIngressOverview } from '@/types/index.d'
import { useI18n } from '@/utilities'
import { getItemStatusFromInsight } from '@/utilities/dataplane'

type ZoneIngressOverviewTableRow = {
  detailViewRoute: RouteLocationNamedRaw
  name: string
  status: StatusKeyword
}

const { t } = useI18n()
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

function transformToTableData(zoneIngressOverviews: ZoneIngressOverview[]): ZoneIngressOverviewTableRow[] {
  return zoneIngressOverviews.map((entity) => {
    const { name } = entity
    const detailViewRoute: RouteLocationNamedRaw = {
      name: 'zone-ingress-detail-view',
      params: {
        zoneIngress: name,
      },
    }
    const status = getItemStatusFromInsight(entity.zoneIngressInsight ?? {})

    return {
      detailViewRoute,
      name,
      status,
    }
  })
}
</script>

<style lang="scss" scoped>
.actions-dropdown {
  display: inline-block;
}
</style>
