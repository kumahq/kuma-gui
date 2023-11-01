<template>
  <RouteView
    v-slot="{ route, t }"
    name="zone-ingress-xds-config-view"
    :params="{
      zoneIngress: '',
      codeSearch: '',
    }"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('zone-ingresses.routes.item.navigation.zone-ingress-xds-config-view')"
            :render="true"
          />
        </h2>
      </template>

      <KCard>
        <template #body>
          <EnvoyData
            :status="getItemStatusFromInsight(props.data.zoneIngressInsight)"
            resource="Zone"
            :src="`/zone-ingresses/${route.params.zoneIngress}/data-path/xds`"
            :query="route.params.codeSearch"
            @query-change="route.update({ codeSearch: $event })"
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
