<template>
  <RouteView :name="(route.name as string)">
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
                name: 'data-plane-detail-view',
                params: {
                  dataPlane: props.name,
                },
              }"
            >
              <RouteTitle
                :title="t('data-planes.routes.item.title', { name: props.name })"
                :render="true"
              />
            </RouterLink>
          </h2>
        </div>
      </template>

      <EmptyBlock v-if="props.dataplaneOverview === undefined">
        {{ t('common.collection.summary.empty_title', { type: 'Data Plane Proxy' }) }}

        <template #message>
          <p>{{ t('common.collection.summary.empty_message', { type: 'Data Plane Proxy' }) }}</p>
        </template>
      </EmptyBlock>

      <div
        v-else
        class="stack"
      >
        <div>
          <h3>{{ t('data-planes.routes.item.overview') }}</h3>

          <DataPlaneSummary
            class="mt-4"
            :dataplane-overview="props.dataplaneOverview"
          />
        </div>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'

import EmptyBlock from '@/app/common/EmptyBlock.vue'
import DataPlaneSummary from '@/app/data-planes/components/DataPlaneSummary.vue'
import type { DataPlaneOverview } from '@/types/index.d'
import { useI18n } from '@/utilities'

const { t } = useI18n()
const route = useRoute()

const props = withDefaults(defineProps<{
  name: string
  dataplaneOverview?: DataPlaneOverview
}>(), {
  dataplaneOverview: undefined,
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
