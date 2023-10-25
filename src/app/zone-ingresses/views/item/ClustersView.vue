<template>
  <RouteView
    v-slot="{ route, t }"
    name="zone-ingress-clusters-view"
    :params="{
      zoneIngress: '',
    }"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('zone-ingresses.routes.item.navigation.zone-ingress-clusters-view')"
            :render="true"
          />
        </h2>
      </template>

      <KCard>
        <template #body>
          <EnvoyData
            :status="getItemStatusFromInsight(props.data.zoneIngressInsight)"
            resource="Zone"
            :src="`/zone-ingresses/${route.params.zoneIngress}/data-path/clusters`"
            query-key="envoy-data-clusters-zone-ingress"
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
