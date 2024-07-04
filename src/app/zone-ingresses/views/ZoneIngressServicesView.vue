<template>
  <RouteView
    v-slot="{ t }"
    name="zone-ingress-services-view"
  >
    <RouteTitle
      :render="false"
      :title="t('zone-ingresses.routes.item.navigation.zone-ingress-services-view')"
    />
    <AppView>
      <KCard>
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
          :items="props.data.zoneIngress.availableServices"
        >
          <template #name="{ row: item }">
            <RouterLink
              :to="{
                name: 'service-detail-view',
                params: {
                  mesh: item.mesh,
                  service: item.tags['kuma.io/service'],
                },
              }"
            >
              {{ item.tags['kuma.io/service'] }}
            </RouterLink>
          </template>

          <template #mesh="{ row: item }">
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

          <template #protocol="{ row: item }">
            {{ item.tags['kuma.io/protocol'] ?? t('common.collection.none') }}
          </template>

          <template #instances="{ row: item }">
            {{ item.instances }}
          </template>

          <template #actions="{ row: item }">
            <XActionGroup>
              <XAction
                :to="{
                  name: 'service-detail-view',
                  params: {
                    mesh: item.mesh,
                    service: item.tags['kuma.io/service'],
                  },
                }"
              >
                {{ t('common.collection.actions.view') }}
              </XAction>
            </XActionGroup>
          </template>
        </AppCollection>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { ZoneIngressOverview } from '../data'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
const props = defineProps<{
  data: ZoneIngressOverview
}>()
</script>
