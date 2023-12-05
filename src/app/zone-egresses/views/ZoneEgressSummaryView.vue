<template>
  <RouteView name="zone-egress-summary-view">
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
                name: 'zone-egress-detail-view',
                params: {
                  zone: props.name,
                },
              }"
            >
              <RouteTitle
                :title="t('zone-egresses.routes.item.title', { name: props.name })"
              />
            </RouterLink>
          </h2>
        </div>
      </template>

      <EmptyBlock v-if="props.zoneEgressOverview === undefined">
        {{ t('common.collection.summary.empty_title', { type: 'ZoneEgress' }) }}

        <template #message>
          <p>{{ t('common.collection.summary.empty_message', { type: 'ZoneEgress' }) }}</p>
        </template>
      </EmptyBlock>

      <div
        v-else
        class="stack"
      >
        <div>
          <h3>{{ t('zone-egresses.routes.item.overview') }}</h3>

          <ZoneEgressSummary
            class="mt-4"
            :zone-egress-overview="props.zoneEgressOverview"
          />
        </div>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import ZoneEgressSummary from '../components/ZoneEgressSummary.vue'
import type { ZoneEgressOverview } from '../data'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = withDefaults(defineProps<{
  name: string
  zoneEgressOverview?: ZoneEgressOverview
}>(), {
  zoneEgressOverview: undefined,
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
