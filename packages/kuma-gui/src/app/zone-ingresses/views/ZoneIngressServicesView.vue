<template>
  <RouteView
    name="zone-ingress-services-view"
    v-slot="{ t }"
  >
    <RouteTitle
      :render="false"
      :title="t('zone-ingresses.routes.item.navigation.zone-ingress-services-view')"
    />
    <AppView>
      <XCard>
        <DataLoader
          :data="[props.data]"
          variant="list"
          v-slot="{ data: [zoneIngress] }"
        >
          <DataCollection
            type="services"
            :items="zoneIngress.zoneIngress.availableServices"
            :total="zoneIngress.zoneIngress.availableServices.length"
          >
            <AppCollection
              data-testid="available-services-collection"
              :headers="[
                { label: 'Name', key: 'name' },
                { label: 'Mesh', key: 'mesh' },
                { label: 'Protocol', key: 'protocol' },
                { label: 'No. instances', key: 'instances' },
              ]"
              :items="zoneIngress.zoneIngress.availableServices"
            >
              <template #name="{ row: item }">
                <template
                  v-for="links in [dataPlaneServiceLinks.map((resolve) =>
                    resolve({ params: { mesh: item.mesh!, service: item.tags['kuma.io/service'] }, dataplaneType: 'standard' }),
                  ).filter((link) => !!link)]"
                  :key="typeof links"
                >
                  <XAction
                    v-if="links.length > 0"
                    :to="links[0]"
                  >
                    {{ item.tags['kuma.io/service'] }}
                  </XAction>
                  <template v-else>
                    {{ item.tags['kuma.io/service'] }}
                  </template>
                </template>
              </template>

              <template #mesh="{ row: item }">
                <XAction
                  :to="{
                    name: 'mesh-detail-view',
                    params: {
                      mesh: item.mesh,
                    },
                  }"
                >
                  {{ item.mesh }}
                </XAction>
              </template>

              <template #protocol="{ row: item }">
                {{ item.tags['kuma.io/protocol'] ?? t('common.collection.none') }}
              </template>

              <template #instances="{ row: item }">
                {{ item.instances }}
              </template>

              <template #actions="{ row: item }">
                <template
                  v-for="links in [dataPlaneServiceLinks.map((resolve) =>
                    resolve({ params: { mesh: item.mesh!, service: item.tags['kuma.io/service'] }, dataplaneType: 'standard' }),
                  ).filter((link) => !!link)]"
                  :key="typeof links"
                >
                  <XActionGroup v-if="links.length > 0">
                    <XAction
                      :to="links[0]"
                    >
                      {{ t('common.collection.actions.view') }}
                    </XAction>
                  </XActionGroup>
                </template>
              </template>
            </AppCollection>
          </DataCollection>
        </DataLoader>
      </XCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { ZoneIngressOverview } from '../data'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import { useDataPlaneServiceLinks } from '@/app/data-planes'
const props = defineProps<{
  data: ZoneIngressOverview | Error | undefined
}>()
const dataPlaneServiceLinks = useDataPlaneServiceLinks()
</script>
