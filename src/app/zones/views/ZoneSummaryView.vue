<template>
  <RouteView name="zone-cp-summary-view">
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
                name: 'zone-cp-detail-view',
                params: {
                  zone: props.name,
                },
              }"
            >
              <RouteTitle
                :title="t('zone-cps.routes.item.title', { name: props.name })"
              />
            </RouterLink>
          </h2>
        </div>
      </template>

      <EmptyBlock v-if="props.zoneOverview === undefined">
        {{ t('common.collection.summary.empty_title', { type: 'Zone' }) }}

        <template #message>
          <p>{{ t('common.collection.summary.empty_message', { type: 'Zone' }) }}</p>
        </template>
      </EmptyBlock>

      <div
        v-else
        class="stack"
      >
        <div>
          <h3>{{ t('zone-cps.routes.item.overview') }}</h3>

          <ZoneSummary
            class="mt-4"
            :zone-overview="props.zoneOverview"
          />
        </div>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import ZoneSummary from '../components/ZoneSummary.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import type { ZoneOverview } from '@/types/index.d'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = withDefaults(defineProps<{
  name: string
  zoneOverview?: ZoneOverview
}>(), {
  zoneOverview: undefined,
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
