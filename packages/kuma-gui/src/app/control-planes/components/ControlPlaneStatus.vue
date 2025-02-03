<template>
  <XCard class="vcp-stats-card">
    <div class="card-header">
      <div class="card-title">
        <h2>{{ t('main-overview.detail.vcp-stats.title') }}</h2>
      </div>
    </div>

    <XLayout
      type="columns"
      class="columns-with-borders"
    >
      <ResourceStatus
        v-if="props.canUseZones"
        :total="props.globalInsight.zones.controlPlanes.total"
        data-testid="zone-control-planes-status"
      >
        <template #icon>
          <img
            class="icon"
            src="@/assets/images/zone.svg?url"
            alt=""
          >
        </template>
      
        <template #title>
          {{ t('main-overview.detail.vcp-stats.zone_control_planes') }}
        </template>
      </ResourceStatus>

      <ResourceStatus
        :total="props.globalInsight.meshes.total"
        data-testid="meshes-status"
      >
        <template #icon>
          <img
            class="icon"
            src="@/assets/images/mesh.svg?url"
            alt=""
          >
        </template>

        <template #title>
          {{ t('main-overview.detail.vcp-stats.meshes') }}
        </template>
      </ResourceStatus>

      <ResourceStatus
        :total="props.globalInsight.services.internal.total"
        data-testid="services-status"
      >
        <template #icon>
          <img
            class="icon"
            src="@/assets/images/icon-wifi-tethering.svg?url"
            alt=""
          >
        </template>

        <template #title>
          {{ t('main-overview.detail.vcp-stats.services') }}
        </template>
      </ResourceStatus>

      <ResourceStatus
        :total="props.globalInsight.dataplanes.standard.total"
        data-testid="data-plane-proxies-status"
      >
        <template #icon>
          <img
            class="icon"
            src="@/assets/images/icon-wifi-tethering.svg?url"
            alt=""
          >
        </template>

        <template #title>
          {{ t('main-overview.detail.vcp-stats.data_plane_proxies') }}
        </template>
      </ResourceStatus>

      <ResourceStatus
        :total="props.globalInsight.policies.total"
        data-testid="policies-status"
      >
        <template #icon>
          <img
            class="icon"
            src="@/assets/images/policy.svg?url"
            alt=""
          >
        </template>

        <template #title>
          {{ t('main-overview.detail.vcp-stats.policies') }}
        </template>
      </ResourceStatus>
    </XLayout>
  </XCard>
</template>

<script lang="ts" setup>
import { useI18n } from '@/app/application'
import ResourceStatus from '@/app/common/ResourceStatus.vue'
import type { GlobalInsight } from '@/app/control-planes/data'

const { t } = useI18n()

const props = defineProps<{
  globalInsight: GlobalInsight
  canUseZones: boolean
}>()
</script>

<style lang="scss" scoped>
.vcp-stats-card {
  container-type: inline-size;
  container-name: vcp-stats-card;
}

.card-header {
  margin-bottom: $kui-space-50;
  min-height: 42px;
}

.icon {
  height: $kui-icon-size-30;
  width: $kui-icon-size-30;
}

// 639px <-> 39.938rem (with base 16px font-size)
@container vcp-stats-card (max-width: 39.938rem) {
  .columns-with-borders > * {
    border-right: unset;
  }
}
</style>
