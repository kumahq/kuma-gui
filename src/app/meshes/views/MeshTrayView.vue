<template>
  <RouteView name="mesh-tray-view">
    <AppView>
      <template #title>
        <div class="tray-title-wrapper">
          <img
            aria-hidden="true"
            src="@/assets/images/icon-circles-ext.svg?url"
          >

          <h2 class="tray-title">
            <RouterLink
              :to="{
                name: 'mesh-detail-view',
                params: {
                  mesh: props.meshInsight.name,
                },
              }"
            >
              <RouteTitle
                :title="t('meshes.routes.item.title', { name: props.meshInsight.name })"
                :render="true"
              />
            </RouterLink>
          </h2>
        </div>
      </template>

      <div class="stack">
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
import ResourceStatus from '@/app/common/ResourceStatus.vue'
import type { MeshInsight } from '@/types/index.d'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = defineProps<{
  meshInsight: MeshInsight
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
