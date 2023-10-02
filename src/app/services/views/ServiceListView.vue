<template>
  <DataSource
    v-slot="{ data: me }: MeSource"
    src="/me"
  >
    <RouteView
      v-if="me"
      v-slot="{ route, t }"
      name="services-list-view"
      :params="{
        page: 1,
        size: me.pageSize,
        mesh: ''
      }"
    >
      <DataSource
        v-slot="{data, error}: ServiceInsightCollectionSource"
        :src="`/meshes/${route.params.mesh}/service-insights?page=${route.params.page}&size=${route.params.size}`"
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
              <ErrorBlock
                v-if="error !== undefined"
                :error="error"
              />

              <AppCollection
                v-else
                class="service-collection"
                data-testid="service-collection"
                :empty-state-message="t('common.emptyState.message', { type: 'Services' })"
                :headers="[
                  { label: 'Name', key: 'name' },
                  { label: 'Type', key: 'serviceType' },
                  { label: 'Address', key: 'addressPort' },
                  { label: 'DP proxies (online / total)', key: 'online' },
                  { label: 'Status', key: 'status' },
                  { label: 'Actions', key: 'actions', hideLabel: true },
                ]"
                :page-number="parseInt(route.params.page)"
                :page-size="parseInt(route.params.size)"
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

                <template #serviceType="{ rowValue }">
                  {{ rowValue || 'internal' }}
                </template>

                <template #addressPort="{ rowValue }">
                  <TextWithCopyButton
                    v-if="rowValue"
                    :text="rowValue"
                  />

                  <template v-else>
                    {{ t('common.collection.none') }}
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
                    {{ t('common.collection.none') }}
                  </template>
                </template>

                <template #status="{ row: item }">
                  <StatusBadge :status="item.status || 'not_available'" />
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
  </DataSource>
</template>

<script lang="ts" setup>
import { KUI_COLOR_TEXT_NEUTRAL_STRONGER, KUI_ICON_SIZE_30 } from '@kong/design-tokens'

import type { ServiceInsightCollectionSource } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import type { MeSource } from '@/app/me/sources'
</script>

<style lang="scss" scoped>
.actions-dropdown {
  display: inline-block;
}
</style>
