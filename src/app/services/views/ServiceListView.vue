<template>
  <RouteView
    v-slot="{ route }"
    name="services-list-view"
  >
    <DataSource
      v-slot="{data, error}: ServiceInsightCollectionSource"
      :src="`/${props.mesh}/services?page=${props.page}&size=${props.size}`"
    >
      <AppView>
        <template #title>
          <h2>
            <RouteTitle
              :title="t('services.routes.items.title')"
              :render="true"
            />
          </h2>
        </template>
        <KCard>
          <template #body>
            <AppCollection
              data-testid="service-collection"
              :empty-state-title="t('common.emptyState.title')"
              :empty-state-message="t('common.emptyState.message', { type: 'Services' })"
              :headers="[
                { label: 'Name', key: 'name' },
                { label: 'Type', key: 'serviceType' },
                { label: 'Address', key: 'addressPort' },
                { label: 'Status', key: 'status' },
                { label: 'DP proxies (online / total)', key: 'online' },
                { label: 'Actions', key: 'actions', hideLabel: true },
              ]"
              :page-number="props.page"
              :page-size="props.size"
              :total="data?.total"
              :items="data?.items"
              :error="error"
              @change="route.update"
            >
              <template #name="{ row: item }">
                <RouterLink
                  :to="{
                    name: 'service-detail-view',
                    params: {
                      service: item.name,
                    },
                  }"
                >
                  {{ item.name }}
                </RouterLink>
              </template>
              <template #status="{ row: item }">
                <StatusBadge
                  v-if="item.status"
                  :status="item.status"
                />

                <template v-else>
                  —
                </template>
              </template>

              <template #online="{ row: item }">
                <template
                  v-if="item.dataplanes"
                >
                  {{ item.dataplanes.online || 0 }} / {{ item.dataplanes.total || 0 }}
                </template>
                <template
                  v-else
                >
                  —
                </template>
              </template>
              <template #actions="{ row: item }">
                <KDropdownMenu
                  class="actions-dropdown"
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
                        to: {
                          name: 'service-detail-view',
                          params: {
                            service: item.name,
                          },
                        },
                        label: t('common.collection.actions.view'),
                      }"
                    />
                  </template>
                </KDropdownMenu>
              </template>
            </AppCollection>
          </template>
        </KCard>
      </AppView>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import {
  KCard,
  KIcon,
  KButton,
  KDropdownItem,
  KDropdownMenu,
} from '@kong/kongponents'

import { ServiceInsightCollectionSource } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import AppView from '@/app/application/components/app-view/AppView.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = defineProps<{
  page: number
  size: number
  //
  mesh: string
}>()

</script>
