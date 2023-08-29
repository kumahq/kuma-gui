<template>
  <RouteView
    name="zone-egress-xds-config-view"
    data-testid="zone-egress-xds-config-view"
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
            :src="`/zone-egresses/${props.data.name}/data-path/xds`"
            query-key="envoy-data-xds-zone-egress"
          />
        </template>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { KCard } from '@kong/kongponents'

import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import EnvoyData from '@/app/common/EnvoyData.vue'
import type { ZoneEgressOverview } from '@/types/index.d'
import { useI18n } from '@/utilities'
import { getItemStatusFromInsight } from '@/utilities/dataplane'

const { t } = useI18n()

const props = defineProps<{
  data: ZoneEgressOverview
}>()
</script>
