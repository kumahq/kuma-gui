<template>
  <RouteView
    name="home"
  >
    <AppView>
      <template #title>
        <h1>
          <RouteTitle
            :title="t('main-overview.routes.item.title')"
            :render="true"
          />
        </h1>
      </template>

      <MainOverview />
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import { useMainOverview } from '@/components'
import { useI18n } from '@/utilities'

const MainOverview = useMainOverview()
const { t } = useI18n()
</script>
