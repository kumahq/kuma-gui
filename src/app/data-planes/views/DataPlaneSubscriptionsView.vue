<template>
  <RouteView
    name="data-plane-subscriptions-view"
    data-testid="data-plane-subscriptions-view"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('data-planes.routes.item.navigation.data-plane-subscriptions-view')"
            :render="true"
          />
        </h2>
      </template>

      <KCard>
        <template #body>
          <SubscriptionList :subscriptions="props.data.dataplaneInsight?.subscriptions ?? []" />
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
import type { DataPlaneOverview } from '@/types/index.d'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = defineProps<{
  data: DataPlaneOverview
}>()
</script>
