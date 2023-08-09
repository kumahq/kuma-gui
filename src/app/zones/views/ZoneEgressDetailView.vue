<template>
  <RouteView
    v-slot="{ route }"
    name="zone-egress-detail-view"
    data-testid="zone-egress-detail-view"
  >
    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'zone-egress-list-view',
          },
          text: t('zone-egresses.routes.item.breadcrumbs')
        },
      ]"
    >
      <template #title>
        <h1>
          <RouteTitle
            :title="t('zone-egresses.routes.item.title', { name: route.params.zoneEgress })"
            :render="true"
          />
        </h1>
      </template>

      <DataSource
        v-slot="{ data, isLoading, error }: ZoneEgressOverviewSource"
        :src="`/zone-egresses/${route.params.zoneEgress}`"
      >
        <LoadingBlock v-if="isLoading" />

        <ErrorBlock
          v-else-if="error !== undefined"
          :error="error"
        />

        <EmptyBlock v-else-if="data === undefined" />

        <ZoneEgressDetails
          v-else
          :zone-egress-overview="data"
          data-testid="detail-view-details"
        />
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import ZoneEgressDetails from '../components/ZoneEgressDetails.vue'
import type { ZoneEgressOverviewSource } from '../sources'
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
