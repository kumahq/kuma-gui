<template>
  <div class="stack">
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
                <TextWithCopyButton :text="props.mesh.name">
                  <RouterLink
                    :to="{
                      name: 'mesh-detail-view',
                      params: {
                        mesh: props.mesh.name,
                      },
                    }"
                  >
                    {{ props.mesh.name }}
                  </RouterLink>
                </TextWithCopyButton>
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
                {{ t('http.api.property.logging') }}
              </template>

              <template #body>
                <KBadge
                  v-if="logging === ''"
                  appearance="neutral"
                >
                  {{ t('meshes.detail.disabled') }}
                </KBadge>

                <template v-else>
                  {{ logging }}
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

            <DefinitionCard>
              <template #title>
                {{ t('http.api.property.tracing') }}
              </template>

              <template #body>
                <KBadge
                  v-if="tracing === ''"
                  appearance="neutral"
                >
                  {{ t('meshes.detail.disabled') }}
                </KBadge>

                <template v-else>
                  {{ tracing }}
                </template>
              </template>
            </DefinitionCard>
          </div>
        </div>
      </template>
    </KCard>

    <ResourceCodeBlock
      id="code-block-mesh"
      :resource="props.mesh"
      :resource-fetcher="fetchMesh"
    />

    <div class="date-status-wrapper">
      <ResourceDateStatus
        :creation-time="props.mesh.creationTime"
        :modification-time="props.mesh.modificationTime"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { KBadge, KCard } from '@kong/kongponents'
import { PropType, computed } from 'vue'
import { useRoute } from 'vue-router'

import DefinitionCard from '@/app/common/DefinitionCard.vue'
import ResourceCodeBlock from '@/app/common/ResourceCodeBlock.vue'
import ResourceDateStatus from '@/app/common/ResourceDateStatus.vue'
import ResourceStatus from '@/app/common/ResourceStatus.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import type { SingleResourceParameters } from '@/types/api.d'
import type { Mesh, MeshBackend, MeshInsight } from '@/types/index.d'
import { useKumaApi, useI18n } from '@/utilities'

const { t } = useI18n()
const kumaApi = useKumaApi()
const route = useRoute()

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
const logging = computed(() => getBackendTypeAndName(props.mesh.logging))
const metrics = computed(() => getBackendTypeAndName(props.mesh.metrics))
const tracing = computed(() => getBackendTypeAndName(props.mesh.tracing))

const totalPolicyCount = computed(() => {
  return Object.values(props.meshInsight.policies ?? {}).reduce((total, stat) => total + stat.total, 0)
})

function getBackendTypeAndName(meshBackend?: MeshBackend) {
  if (!meshBackend || !Array.isArray(meshBackend.backends) || meshBackend.backends.length === 0) {
    return ''
  }

  const enabledBackendName = meshBackend.enabledBackend ?? meshBackend.defaultBackend ?? meshBackend.backends[0].name
  const enabledBackend = meshBackend.backends.find((backend) => backend.name === enabledBackendName)

  if (enabledBackend === undefined) {
    return ''
  }

  return `${enabledBackend.type} / ${enabledBackend.name}`
}

async function fetchMesh(params?: SingleResourceParameters) {
  const name = route.params.mesh as string
  return await kumaApi.getMesh({ name }, params)
}
</script>

<style lang="scss" scoped>
.date-status-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
