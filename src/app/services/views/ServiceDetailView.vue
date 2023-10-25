<template>
  <RouteView
    v-slot="{ route }"
    name="service-detail-view"
    :params="{
      mesh: '',
      service: '',
    }"
  >
    <AppView>
      <div class="stack">
        <KCard>
          <template #body>
            <ExternalServiceDetails
              v-if="props.data.serviceType === 'external'"
              :mesh="route.params.mesh"
              :service="route.params.service"
            />

            <ServiceInsightDetails
              v-else
              :service-insight="data"
            />
          </template>
        </KCard>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import ExternalServiceDetails from '../components/ExternalServiceDetails.vue'
import ServiceInsightDetails from '../components/ServiceInsightDetails.vue'
import type { ServiceInsight } from '@/types/index.d'

const props = defineProps<{
  data: ServiceInsight
}>()
</script>
