<template>
  <RouteView>
    <RouteTitle
      :title="t('main-overview.routes.item.title')"
    />
    <AppView>
      <div class="stack">
        <OverviewCharts />
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import { useOverviewCharts } from '@/components'
import { useI18n } from '@/utilities'

const OverviewCharts = useOverviewCharts()
const { t } = useI18n()
</script>
