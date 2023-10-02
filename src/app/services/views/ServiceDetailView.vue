<template>
  <RouteView
    v-slot="{ route, t }"
    name="service-detail-view"
    :params="{
      mesh: '',
      service: ''
    }"
  >
    <AppView>
      <template v-if="props.data.serviceType === 'external'">
        <DataSource
          v-slot="{ data: externalService, error }: ExternalServiceSource"
          :src="`/meshes/${route.params.mesh}/external-services/for/${route.params.service}`"
        >
          <ErrorBlock
            v-if="error"
            :error="error"
          />

          <LoadingBlock v-else-if="externalService === undefined" />

          <EmptyBlock
            v-else-if="externalService === null"
            data-testid="no-matching-external-service"
          >
            <template #title>
              <p>{{ t('services.detail.no_matching_external_service', { name: route.params.service }) }}</p>
            </template>
          </EmptyBlock>

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
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import type { ServiceInsight } from '@/types/index.d'

const props = defineProps<{
  data: ServiceInsight
}>()
</script>
