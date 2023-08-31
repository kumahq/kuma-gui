<template>
  <RouteView
    v-slot="{ route }"
    name="service-detail-view"
    data-testid="service-detail-view"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('services.routes.item.navigation.service-detail-view')"
            :render="true"
          />
        </h2>
      </template>

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
            :service-insight="data"
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
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import type { ServiceInsight } from '@/types/index.d'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = defineProps<{
  data: ServiceInsight
}>()
</script>
