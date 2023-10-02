<template>
  <RouteView
    v-slot="{ t }"
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
import { useMainOverview } from '@/components'
const MainOverview = useMainOverview()
</script>
