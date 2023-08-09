<template>
  <RouteView
    v-slot="{ route }"
    name="zone-ingress-detail-view"
    data-testid="zone-ingress-detail-view"
  >
    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'zone-ingress-list-view',
          },
          text: t('zone-ingresses.routes.item.breadcrumbs')
        },
      ]"
    >
      <template #title>
        <h1>
          <RouteTitle
            :title="t('zone-ingresses.routes.item.title', { name: route.params.zoneIngress })"
            :render="true"
          />
        </h1>
      </template>

      <DataSource
        v-slot="{ data, isLoading, error }: ZoneIngressOverviewSource"
        :src="`/zone-ingresses/${route.params.zoneIngress}`"
      >
        <LoadingBlock v-if="isLoading" />

        <ErrorBlock
          v-else-if="error !== undefined"
          :error="error"
        />

        <EmptyBlock v-else-if="data === undefined" />

        <ZoneIngressDetails
          v-else
          :zone-ingress-overview="data"
          data-testid="detail-view-details"
        />
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import ZoneIngressDetails from '../components/ZoneIngressDetails.vue'
import type { ZoneIngressOverviewSource } from '../sources'
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
