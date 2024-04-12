<template>
  <KCard>
    <div class="stack">
      <div class="columns">
        <ResourceStatus
          :total="props.meshInsight?.services.total ?? 0"
          data-testid="services-status"
        >
          <template #title>
            {{ t('meshes.detail.services') }}
          </template>
        </ResourceStatus>

        <ResourceStatus
          :total="props.meshInsight?.dataplanesByType.standard.total ?? 0"
          data-testid="data-plane-proxies-status"
        >
          <template #title>
            {{ t('meshes.detail.data_plane_proxies') }}
          </template>
        </ResourceStatus>

        <ResourceStatus
          :total="props.meshInsight?.totalPolicyCount ?? 0"
          data-testid="policies-status"
        >
          <template #title>
            {{ t('meshes.detail.policies') }}
          </template>
        </ResourceStatus>
      </div>

      <div class="columns">
        <DefinitionCard>
          <template #title>
            {{ t('http.api.property.mtls') }}
          </template>

          <template #body>
            <KBadge
              v-if="!props.mesh.mtlsBackend"
              appearance="neutral"
            >
              {{ t('meshes.detail.disabled') }}
            </KBadge>

            <template v-else>
              {{ props.mesh.mtlsBackend.type }} / {{ props.mesh.mtlsBackend.name }}
            </template>
          </template>
        </DefinitionCard>

        <DefinitionCard>
          <template #title>
            {{ t('http.api.property.metrics') }}
          </template>

          <template #body>
            <KBadge
              v-if="!props.mesh.metricsBackend"
              appearance="neutral"
            >
              {{ t('meshes.detail.disabled') }}
            </KBadge>

            <template v-else>
              {{ props.mesh.metricsBackend.type }} / {{ props.mesh.metricsBackend.name }}
            </template>
          </template>
        </DefinitionCard>

        <DefinitionCard>
          <template #title>
            {{ t('http.api.property.zoneEgress') }}
          </template>

          <template #body>
            <KBadge appearance="neutral">
              {{ t(`meshes.detail.${Boolean(props.mesh.routing?.zoneEgress) ? 'enabled' : 'disabled'}`) }}
            </KBadge>
          </template>
        </DefinitionCard>
      </div>
    </div>
  </KCard>
</template>

<script lang="ts" setup>
import type { Mesh, MeshInsight } from '../data'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import ResourceStatus from '@/app/common/ResourceStatus.vue'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = withDefaults(defineProps<{
  mesh: Mesh
  meshInsight?: MeshInsight
}>(), {
  meshInsight: undefined,
})
</script>
