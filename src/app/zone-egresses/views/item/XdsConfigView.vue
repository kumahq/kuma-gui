<template>
  <RouteView
    v-slot="{ route, t }"
    name="zone-egress-xds-config-view"
    :params="{
      zoneEgress: '',
    }"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('zone-egresses.routes.item.navigation.zone-egress-xds-config-view')"
            :render="true"
          />
        </h2>
      </template>

      <KCard>
        <template #body>
          <EnvoyData
            :status="getItemStatusFromInsight(props.data.zoneEgressInsight)"
            resource="Zone"
            :src="`/zone-egresses/${route.params.zoneEgress}/data-path/xds`"
          />
        </template>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import EnvoyData from '@/app/common/EnvoyData.vue'
import type { ZoneEgressOverview } from '@/types/index.d'
import { getItemStatusFromInsight } from '@/utilities/dataplane'

const props = defineProps<{
  data: ZoneEgressOverview
}>()
</script>
