<template>
  <KCard>
    <template #body>
      <DataSource
        v-slot="{ data, error }: GlobalInsightSource"
        src="/global-insight"
      >
        <ErrorBlock
          v-if="error"
          :error="error"
        />

        <LoadingBlock v-else-if="data === undefined" />

        <template v-else>
          <div class="card-header">
            <div class="card-title">
              <h2>{{ t('main-overview.detail.health.title') }}</h2>
            </div>
          </div>

          <div
            class="columns"
          >
            <ResourceStatus
              v-if="can('use zones')"
              :total="data.zones.controlPlanes.total"
              :online="data.zones.controlPlanes.online"
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
              :total="data.meshes.total"
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
              :total="data.services.internal.total"
              :online="data.services.internal.online"
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
              :total="data.dataplanes.standard.total"
              :online="data.dataplanes.standard.online"
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
        </template>
      </DataSource>
    </template>
  </KCard>
</template>

<script lang="ts" setup>
import { GlobalInsightSource } from '../sources'
import { useCan, useI18n } from '@/app/application'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import ResourceStatus from '@/app/common/ResourceStatus.vue'

const { t } = useI18n()
const can = useCan()
</script>
<style lang="scss" scoped>
.card-header {
  margin-bottom: $kui-space-50;
  min-height: 42px;
}
</style>
