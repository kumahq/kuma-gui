<template>
  <RouteView
    name="zone-cp-subscriptions-view"
    data-testid="zone-cp-subscriptions-view"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('zone-cps.routes.item.navigation.zone-cp-subscriptions-view')"
            :render="true"
          />
        </h2>
      </template>

      <KCard>
        <template #body>
          <SubscriptionList :subscriptions="props.data.zoneInsight?.subscriptions ?? []" />
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
import SubscriptionList from '@/app/common/subscriptions/SubscriptionList.vue'
import type { ZoneOverview } from '@/types/index.d'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = defineProps<{
  data: ZoneOverview
}>()
</script>
