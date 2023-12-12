<template>
  <RouteView name="zone-ingress-summary-view">
    <AppView>
      <template #title>
        <div class="summary-title-wrapper">
          <img
            aria-hidden="true"
            src="@/assets/images/icon-location-on.svg?url"
          >

          <h2 class="summary-title">
            <RouterLink
              :to="{
                name: 'zone-ingress-detail-view',
                params: {
                  zone: props.name,
                },
              }"
            >
              <RouteTitle
                :title="t('zone-ingresses.routes.item.title', { name: props.name })"
              />
            </RouterLink>
          </h2>
        </div>
      </template>

      <EmptyBlock v-if="props.zoneIngressOverview === undefined">
        {{ t('common.collection.summary.empty_title', { type: 'ZoneIngress' }) }}

        <template #message>
          <p>{{ t('common.collection.summary.empty_message', { type: 'ZoneIngress' }) }}</p>
        </template>
      </EmptyBlock>

      <div
        v-else
        class="stack"
      >
        <div>
          <h3>{{ t('zone-ingresses.routes.item.overview') }}</h3>

          <ZoneIngressSummary
            class="mt-4"
            :zone-ingress-overview="props.zoneIngressOverview"
          />
        </div>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import ZoneIngressSummary from '../components/ZoneIngressSummary.vue'
import type { ZoneIngressOverview } from '../data'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = withDefaults(defineProps<{
  name: string
  zoneIngressOverview?: ZoneIngressOverview
}>(), {
  zoneIngressOverview: undefined,
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
