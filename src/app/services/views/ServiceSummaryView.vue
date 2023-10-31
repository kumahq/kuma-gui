<template>
  <RouteView name="service-summary-view">
    <AppView>
      <template #title>
        <div class="summary-title-wrapper">
          <img
            aria-hidden="true"
            src="@/assets/images/icon-wifi-tethering.svg?url"
          >

          <h2 class="summary-title">
            <RouterLink
              :to="{
                name: 'service-detail-view',
                params: {
                  service: props.name,
                },
              }"
            >
              <RouteTitle
                :title="t('services.routes.item.title', { name: props.name })"
                :render="true"
              />
            </RouterLink>
          </h2>
        </div>
      </template>

      <EmptyBlock v-if="props.service === undefined">
        {{ t('common.collection.summary.empty_title', { type: 'Service' }) }}

        <template #message>
          <p>{{ t('common.collection.summary.empty_message', { type: 'Service' }) }}</p>
        </template>
      </EmptyBlock>

      <div
        v-else
        class="stack"
      >
        <div>
          <h3>{{ t('services.routes.item.overview') }}</h3>

          <div class="mt-4">
            <ExternalServiceDetails
              v-if="props.service.serviceType === 'external'"
              :mesh="props.service.mesh"
              :service="props.service.name"
            />

            <ServiceInsightDetails
              v-else
              :service-insight="props.service"
            />
          </div>
        </div>

        <div v-if="props.service.serviceType === 'external'">
          <h3>{{ t('services.routes.item.config') }}</h3>

          <ExternalServiceConfig
            class="mt-4"
            :mesh="props.service.mesh"
            :service="props.service.name"
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
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import { ServiceInsight } from '@/types/index.d'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = withDefaults(defineProps<{
  name: string
  service?: ServiceInsight
}>(), {
  service: undefined,
})
</script>

<style lang="scss" scoped>
.summary-title-wrapper {
  display: flex;
  align-items: baseline;
  gap: $kui-space-30;
  // Accounts for the absolutely-positioned close button
  margin-right: calc($kui-space-30 + 24px);
}

.summary-title {
  margin-top: 0;
}
</style>
