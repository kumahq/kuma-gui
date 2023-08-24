<template>
  <KCard>
    <template #body>
      <div class="stack">
        <div
          class="columns"
          style="--columns: 4"
        >
          <DefinitionCard>
            <template #title>
              {{ t('http.api.property.name') }}
            </template>

            <template #body>
              <TextWithCopyButton :text="props.mesh.name" />
            </template>
          </DefinitionCard>

          <ResourceStatus
            :total="props.meshInsight.services.total ?? 0"
            data-testid="services-status"
          >
            <template #title>
              {{ t('meshes.detail.services') }}
            </template>
          </ResourceStatus>

          <ResourceStatus
            :total="props.meshInsight.dataplanesByType.standard.total ?? 0"
            data-testid="data-plane-proxies-status"
          >
            <template #title>
              {{ t('meshes.detail.data_plane_proxies') }}
            </template>
          </ResourceStatus>

          <ResourceStatus
            :total="totalPolicyCount"
            data-testid="policies-status"
          >
            <template #title>
              {{ t('meshes.detail.policies') }}
            </template>
          </ResourceStatus>
        </div>

        <div
          class="columns"
          style="--columns: 4"
        >
          <DefinitionCard>
            <template #title>
              {{ t('http.api.property.mtls') }}
            </template>

            <template #body>
              <KBadge
                v-if="mtls === ''"
                appearance="neutral"
              >
                {{ t('meshes.detail.disabled') }}
              </KBadge>

              <template v-else>
                {{ mtls }}
              </template>
            </template>
          </DefinitionCard>

          <DefinitionCard>
            <template #title>
              {{ t('http.api.property.metrics') }}
            </template>

            <template #body>
              <KBadge
                v-if="metrics === ''"
                appearance="neutral"
              >
                {{ t('meshes.detail.disabled') }}
              </KBadge>

              <template v-else>
                {{ metrics }}
              </template>
            </template>
          </DefinitionCard>
        </div>
      </div>
    </template>
  </KCard>
</template>

<script lang="ts" setup>
import { KBadge, KCard } from '@kong/kongponents'
import { PropType, computed } from 'vue'

import DefinitionCard from '@/app/common/DefinitionCard.vue'
import ResourceStatus from '@/app/common/ResourceStatus.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import type { Mesh, MeshBackend, MeshInsight } from '@/types/index.d'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = defineProps({
  mesh: {
    type: Object as PropType<Mesh>,
    required: true,
  },

  meshInsight: {
    type: Object as PropType<MeshInsight>,
    required: true,
  },
})

const mtls = computed(() => getBackendTypeAndName(props.mesh.mtls))
const metrics = computed(() => getBackendTypeAndName(props.mesh.metrics))

const totalPolicyCount = computed(() => {
  return Object.values(props.meshInsight.policies ?? {}).reduce((total, stat) => total + stat.total, 0)
})

function getBackendTypeAndName(meshBackend?: MeshBackend): string {
  if (!meshBackend || !Array.isArray(meshBackend?.backends) || meshBackend.backends.length === 0) {
    return ''
  }

  const enabledBackendName = meshBackend.enabledBackend ?? meshBackend.defaultBackend ?? meshBackend.backends[0].name
  const enabledBackend = meshBackend.backends.find((backend) => backend.name === enabledBackendName)

  if (enabledBackend === undefined) {
    return ''
  }

  return `${enabledBackend.type} / ${enabledBackend.name}`
}
</script>
