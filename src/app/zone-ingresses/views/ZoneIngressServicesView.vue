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
          />
        </h2>
      </template>

      <KCard>
        <template #body>
          <AppCollection
            data-testid="available-services-collection"
            :empty-state-message="t('common.emptyState.message', { type: 'Services' })"
            :headers="[
              { label: 'Name', key: 'name' },
              { label: 'Mesh', key: 'mesh' },
              { label: 'Protocol', key: 'protocol' },
              { label: 'No. Instances', key: 'instances' },
              { label: 'Actions', key: 'actions', hideLabel: true },
            ]"
            :items="props.data.zoneIngress.availableServices.map((service) => ({ ...service, name: service.tags['kuma.io/service'] }))"
            :get-detail-route="(row) => ({
              name: 'service-detail-view',
              params: {
                mesh: row.mesh,
                service: row.tags['kuma.io/service'],
              },
            })"
          >
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
              {{ item.tags['kuma.io/protocol'] ?? t('common.collection.none') }}
            </template>

            <template #instances="{ row: item }">
              {{ item.instances }}
            </template>
          </AppCollection>
        </template>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { AvailableService, ZoneIngressOverview } from '../data'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'

const props = defineProps<{
  data: ZoneIngressOverview
}>()
</script>
