<template>
  <KCard>
    <div class="card-header">
      <div class="card-title">
        <h2>{{ t('main-overview.detail.health.title') }}</h2>
      </div>
    </div>

    <div class="columns">
      <ResourceStatus
        v-if="props.canUseZones"
        :total="props.globalInsight.zones.controlPlanes.total"
        :online="props.globalInsight.zones.controlPlanes.online"
        data-testid="zone-control-planes-status"
      >
        <template #icon>
          <img src="@/assets/images/icon-location-on.svg?url">
        </template>

        <template #title>
          {{ t('main-overview.detail.health.zone_control_planes') }}
        </template>
      </ResourceStatus>

      <ResourceStatus
        :total="props.globalInsight.meshes.total"
        data-testid="meshes-status"
      >
        <template #icon>
          <img src="@/assets/images/icon-circles-ext.svg?url">
        </template>

        <template #title>
          {{ t('main-overview.detail.health.meshes') }}
        </template>
      </ResourceStatus>

      <ResourceStatus
        :total="props.globalInsight.services.internal.total"
        :online="props.globalInsight.services.internal.online"
        data-testid="services-status"
      >
        <template #icon>
          <img src="@/assets/images/icon-wifi-tethering.svg?url">
        </template>

        <template #title>
          {{ t('main-overview.detail.health.services') }}
        </template>
      </ResourceStatus>

      <ResourceStatus
        :total="props.globalInsight.dataplanes.standard.total"
        :online="props.globalInsight.dataplanes.standard.online"
        data-testid="data-plane-proxies-status"
      >
        <template #icon>
          <img src="@/assets/images/icon-wifi-tethering.svg?url">
        </template>

        <template #title>
          {{ t('main-overview.detail.health.data_plane_proxies') }}
        </template>
      </ResourceStatus>
    </div>
  </KCard>
</template>

<script lang="ts" setup>
import { useI18n } from '@/app/application'
import ResourceStatus from '@/app/common/ResourceStatus.vue'
import type { GlobalInsight } from '@/types/index.d'

const { t } = useI18n()

const props = defineProps<{
  globalInsight: GlobalInsight
  canUseZones: boolean
}>()
</script>

<style lang="scss" scoped>
.card-header {
  margin-bottom: $kui-space-50;
  min-height: 42px;
}
</style>
