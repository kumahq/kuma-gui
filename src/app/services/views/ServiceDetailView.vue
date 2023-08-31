<template>
  <RouteView
    v-slot="{ route }"
    name="service-detail-view"
    data-testid="service-detail-view"
  >
    <AppView>
      <template v-if="props.data.serviceType === 'external'">
        <DataSource
          v-slot="{ data: externalService, error }: ExternalServiceSource"
          :src="`/meshes/${route.params.mesh}/external-services/${route.params.service}`"
        >
          <ErrorBlock
            v-if="error"
            :error="error"
          />

          <LoadingBlock v-else-if="externalService === undefined" />

          <ExternalServiceDetails
            v-else
            :external-service="externalService"
          />
        </DataSource>
      </template>

      <ServiceInsightDetails
        v-else
        :service-insight="data"
      />
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import ExternalServiceDetails from '../components/ExternalServiceDetails.vue'
import ServiceInsightDetails from '../components/ServiceInsightDetails.vue'
import type { ExternalServiceSource } from '../sources'
import AppView from '@/app/application/components/app-view/AppView.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import type { ServiceInsight } from '@/types/index.d'

const props = defineProps<{
  data: ServiceInsight
}>()
</script>
