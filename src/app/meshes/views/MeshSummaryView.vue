<template>
  <RouteView name="mesh-summary-view">
    <AppView>
      <template #title>
        <div class="summary-title-wrapper">
          <img
            aria-hidden="true"
            src="@/assets/images/icon-circles-ext.svg?url"
          >

          <h2 class="summary-title">
            <RouterLink
              :to="{
                name: 'mesh-detail-view',
                params: {
                  mesh: props.name,
                },
              }"
            >
              <RouteTitle
                :title="t('meshes.routes.item.title', { name: props.name })"
                :render="true"
              />
            </RouterLink>
          </h2>
        </div>
      </template>

      <EmptyBlock v-if="props.meshInsight === undefined">
        {{ t('common.collection.summary.empty_title') }}

        <template #message>
          <p>{{ t('common.collection.summary.empty_message') }}</p>
        </template>
      </EmptyBlock>

      <div
        v-else
        class="stack"
      >
        <div>
          <h3>{{ t('meshes.routes.item.overview') }}</h3>

          <div class="mt-4 stack">
            <ResourceStatus
              :total="props.meshInsight.services.total ?? 0"
              data-testid="services-status"
            >
              <template #title>
                {{ t('meshes.detail.services') }}
              </template>
            </ResourceStatus>

            <ResourceStatus
              :online="props.meshInsight.dataplanesByType.standard.online ?? 0"
              :total="props.meshInsight.dataplanesByType.standard.total ?? 0"
              data-testid="data-plane-proxies-status"
            >
              <template #title>
                {{ t('meshes.detail.data_plane_proxies') }}
              </template>
            </ResourceStatus>
          </div>
        </div>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ResourceStatus from '@/app/common/ResourceStatus.vue'
import type { MeshInsight } from '@/types/index.d'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = withDefaults(defineProps<{
  name: string
  meshInsight?: MeshInsight
}>(), {
  meshInsight: undefined,
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
