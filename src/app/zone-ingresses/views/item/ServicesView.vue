<template>
  <RouteView
    v-slot="{ t }"
    name="zone-ingress-services-view"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('zone-ingresses.routes.item.navigation.zone-ingress-services-view')"
            :render="true"
          />
        </h2>
      </template>

      <KCard>
        <template #body>
          <AppCollection
            :empty-state-message="t('common.emptyState.message', { type: 'Services' })"
            :headers="[
              { label: 'Name', key: 'name' },
              { label: 'Mesh', key: 'mesh' },
              { label: 'Protocol', key: 'protocol' },
              { label: 'No. Instances', key: 'instances' },
              { label: 'Actions', key: 'actions', hideLabel: true },
            ]"
            :items="props.data.zoneIngress.availableServices"
          >
            <template #name="{ row: item }: {row: AvailableService}">
              <template
                v-for="service in [item.tags?.['kuma.io/service'] ?? t('common.collection.none')]"
                :key="service"
              >
                <RouterLink
                  v-if="service.length > 0"
                  :to="{
                    name: 'service-detail-view',
                    params: {
                      mesh: item.mesh,
                      service: service,
                    },
                  }"
                >
                  {{ service }}
                </RouterLink>
                <template
                  v-else
                >
                  {{ service }}
                </template>
              </template>
            </template>

            <template #mesh="{ row: item }: {row: AvailableService}">
              <RouterLink
                :to="{
                  name: 'mesh-detail-view',
                  params: {
                    mesh: item.mesh,
                  },
                }"
              >
                {{ item.mesh }}
              </RouterLink>
            </template>

            <template #protocol="{ row: item }: {row: AvailableService}">
              {{ item.tags?.['kuma.io/protocol'] ?? t('common.collection.none') }}
            </template>

            <template #instances="{ row: item }">
              {{ item.instances }}
            </template>

            <template #actions="{ row: item }: {row: AvailableService}">
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
                    <MoreIcon :size="KUI_ICON_SIZE_30" />
                  </KButton>
                </template>
                <template #items>
                  <KDropdownItem
                    :item="{
                      to: {
                        name: 'service-detail-view',
                        params: {
                          mesh: item.mesh,
                          service: item.tags?.['kuma.io/service'] ?? t('common.collection.none'),
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
  </RouteView>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'

import type { AvailableService, ZoneIngressOverview } from '../../data'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
const props = defineProps<{
  data: ZoneIngressOverview
}>()
</script>
