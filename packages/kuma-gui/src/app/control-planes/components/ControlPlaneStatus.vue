<template>
  <XCard class="about-card">
    <div class="card-header">
      <div class="card-title">
        <h2>{{ t('main-overview.detail.about.title') }}</h2>
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
          {{ t('main-overview.detail.about.zone_control_planes') }}
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
          {{ t('main-overview.detail.about.meshes') }}
        </template>
      </ResourceStatus>

      <template
        v-for="meshServicesGeneric in [(['MeshService', 'MeshMultiZoneService', 'MeshExternalService'] as const).reduce((acc, curr) => ({ total: acc.total + props.globalInsight.resources[curr].total }), { total: 0 })]"
        :key="typeof meshServicesGeneric"
      >
        <ResourceStatus
          :total="meshServicesGeneric.total || props.globalInsight.services.internal.total"
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
            <XI18n
              path="main-overview.detail.about.services"
            />
          </template>

          <template
            v-if="meshServicesGeneric.total && props.globalInsight.services.internal.total > 0"
            #description
          >
            <XI18n
              path="main-overview.detail.about.descriptions.mesh_services"
            />
          </template>

          <template
            v-if="meshServicesGeneric.total && props.globalInsight.services.internal.total > 0"
            #body
          >
            <ResourceStatus :total="props.globalInsight.services.internal.total">
              <template #description>
                <XI18n
                  path="main-overview.detail.about.descriptions.internal_services"
                />

                <XIcon
                  name="info"
                >
                  <XI18n
                    path="main-overview.detail.about.infos.internal_services"
                  />
                </XIcon>
              </template>
            </ResourceStatus>
          </template>
        </ResourceStatus>
      </template>

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
          {{ t('main-overview.detail.about.data_plane_proxies') }}
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
          {{ t('main-overview.detail.about.policies') }}
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
.about-card {
  container-type: inline-size;
  container-name: about-card;
  contain: layout;
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
@container about-card (max-width: 39.938rem) {
  .columns-with-borders > * {
    border-right: unset;
  }
}
</style>
