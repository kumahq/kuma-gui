<template>
  <RouteView
    v-slot="{ route }"
    name="zone-cp-detail-view"
  >
    <RouteTitle :title="t('zone-cps.routes.item.title', { name: route.params.zone })" />

    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'zone-cp-list-view',
          },
          text: t('zone-cps.routes.item.breadcrumbs')
        },
      ]"
    >
      <DataSource
        v-slot="{ data, isLoading, error }: ZoneOverviewSource"
        :src="`/zone-cps/${route.params.zone}`"
      >
        <LoadingBlock v-if="isLoading" />

        <ErrorBlock
          v-else-if="error !== undefined"
          :error="error"
        />

        <EmptyBlock v-else-if="data === undefined" />

        <div
          v-else
          class="kcard-border"
          data-testid="detail-view-details"
        >
          <ZoneDetails :zone-overview="data" />
        </div>
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import ZoneDetails from '../components/ZoneDetails.vue'
import type { ZoneOverviewSource } from '../sources'
import AppView from '@/app/application/components/app-view/AppView.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import { useI18n } from '@/utilities'

const { t } = useI18n()
</script>
