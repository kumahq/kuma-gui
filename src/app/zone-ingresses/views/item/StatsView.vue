<template>
  <RouteView
    v-slot="{ route, t }"
    name="zone-ingress-stats-view"
    :params="{
      zoneIngress: ''
    }"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('zone-ingresses.routes.item.navigation.zone-ingress-stats-view')"
            :render="true"
          />
        </h2>
      </template>

      <KCard>
        <template #body>
          <EnvoyData
            :status="getItemStatusFromInsight(props.data.zoneIngressInsight)"
            resource="Zone"
            :src="`/zone-ingresses/${route.params.zoneIngress}/data-path/stats`"
            query-key="envoy-data-stats-zone-ingress"
          />
        </template>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import EnvoyData from '@/app/common/EnvoyData.vue'
import type { ZoneIngressOverview } from '@/types/index.d'
import { getItemStatusFromInsight } from '@/utilities/dataplane'

const props = defineProps<{
  data: ZoneIngressOverview
}>()
</script>
