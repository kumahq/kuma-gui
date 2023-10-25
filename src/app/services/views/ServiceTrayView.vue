<template>
  <RouteView name="service-tray-view">
    <AppView>
      <template #title>
        <div class="tray-title-wrapper">
          <img
            aria-hidden="true"
            src="@/assets/images/icon-wifi-tethering.svg?url"
          >

          <h2 class="tray-title">
            <RouterLink
              :to="{
                name: 'service-detail-view',
                params: {
                  service: props.data.name,
                },
              }"
            >
              <RouteTitle
                :title="t('services.routes.item.title', { name: props.data.name })"
                :render="true"
              />
            </RouterLink>
          </h2>
        </div>
      </template>

      <div class="stack">
        <div>
          <h3>{{ t('services.routes.item.overview') }}</h3>

          <div class="mt-4">
            <ExternalServiceDetails
              v-if="props.data.serviceType === 'external'"
              :mesh="props.data.mesh"
              :service="props.data.name"
            />

            <ServiceInsightDetails
              v-else
              :service-insight="data"
            />
          </div>
        </div>

        <div v-if="props.data.serviceType === 'external'">
          <h3>{{ t('services.routes.item.config') }}</h3>

          <ExternalServiceConfig
            class="mt-4"
            :mesh="props.data.mesh"
            :service="props.data.name"
          />
        </div>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import ExternalServiceConfig from '../components/ExternalServiceConfig.vue'
import ExternalServiceDetails from '../components/ExternalServiceDetails.vue'
import ServiceInsightDetails from '../components/ServiceInsightDetails.vue'
import { ServiceInsight } from '@/types/index.d'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = defineProps<{
  data: ServiceInsight
}>()
</script>

<style lang="scss" scoped>
.tray-title-wrapper {
  display: flex;
  align-items: baseline;
  gap: $kui-space-30;
  // Accounts for the absolutely-positioned close button
  margin-right: calc($kui-space-30 + 24px);
}

.tray-title {
  margin-top: 0;
}
</style>
