<template>
  <XCard>
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
          :online="props.meshInsight?.dataplanesByType.standard.online ?? 0"
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
        <DefinitionCard>
          <template #title>
            {{ t('http.api.property.mtls') }}
          </template>

          <template #body>
            <XBadge
              v-if="!props.mesh.mtlsBackend"
              appearance="neutral"
            >
              {{ t('meshes.detail.disabled') }}
            </XBadge>

            <template v-else>
              {{ props.mesh.mtlsBackend.type }} / {{ props.mesh.mtlsBackend.name }}
            </template>
          </template>
        </DefinitionCard>
      </div>
    </div>
  </XCard>
</template>

<script lang="ts" setup>
import type { Mesh, MeshInsight } from '../data'
import { useI18n } from '@/app/application'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import ResourceStatus from '@/app/common/ResourceStatus.vue'

const { t } = useI18n()

const props = withDefaults(defineProps<{
  mesh: Mesh
  meshInsight?: MeshInsight
}>(), {
  meshInsight: undefined,
})
</script>
