<template>
  <XCard>
    <div class="card-header">
      <div class="card-title">
        <h2>{{ t('main-overview.detail.health.title') }}</h2>
      </div>
    </div>

    <XLayout
      type="columns"
      class="columns-with-borders"
    >
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

        <template
          v-if="props.globalInsight.zones.controlPlanes.total !== props.globalInsight.zones.controlPlanes.online"
          #info
        >
          <XIcon
            name="info"
            :color="KUI_COLOR_TEXT_NEUTRAL"
          >
            <XI18n
              path="main-overview.detail.health.info.zone-cps"
            />
          </XIcon>
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

        <template
          v-if="props.globalInsight.services.internal.total !== props.globalInsight.services.internal.online"
          #info
        >
          <XIcon
            name="info"
            :color="KUI_COLOR_TEXT_NEUTRAL"
          >
            <XI18n
              path="main-overview.detail.health.info.services"
            />
          </XIcon>
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

        <template
          v-if="props.globalInsight.dataplanes.standard.total !== props.globalInsight.dataplanes.standard.online"
          #info
        >
          <XIcon
            name="info"
            :color="KUI_COLOR_TEXT_NEUTRAL"
          >
            <XI18n
              path="main-overview.detail.health.info.dpps"
            />
          </XIcon>
        </template>
      </ResourceStatus>
    </XLayout>
  </XCard>
</template>

<script lang="ts" setup>
import { KUI_COLOR_TEXT_NEUTRAL } from '@kong/design-tokens'

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
.card-header {
  margin-bottom: $kui-space-50;
  min-height: 42px;
}
</style>
