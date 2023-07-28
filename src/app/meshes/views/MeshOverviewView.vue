<template>
  <RouteView>
    <RouteTitle
      :title="t('meshes.routes.overview.title')"
    />
    <AppView>
      <div class="stack">
        <KCard>
          <template #body>
            <MeshCharts />
          </template>
        </KCard>

        <KCard v-if="mesh !== null">
          <template #body>
            <div class="columns">
              <StatusInfo
                :is-loading="isLoading"
                :error="error"
                :is-empty="mesh === null || meshInsights === null"
              >
                <DefinitionList>
                  <DefinitionListItem
                    v-for="(value, property) in basicMesh"
                    :key="property"
                    :term="t(`http.api.property.${property}`)"
                  >
                    <KBadge
                      v-if="typeof value === 'boolean'"
                      :appearance="value ? 'success' : 'danger'"
                    >
                      {{ value ? 'Enabled' : 'Disabled' }}
                    </KBadge>

                    <template v-else-if="property === 'name' && typeof value === 'string'">
                      <TextWithCopyButton :text="value" />
                    </template>

                    <template v-else>
                      {{ value }}
                    </template>
                  </DefinitionListItem>
                </DefinitionList>
              </StatusInfo>

              <DefinitionList>
                <DefinitionListItem
                  v-for="(value, property) in extendedMesh"
                  :key="property"
                  :term="t(`http.api.property.${property}`)"
                >
                  <KBadge
                    v-if="typeof value === 'boolean'"
                    :appearance="value ? 'success' : 'danger'"
                  >
                    {{ value ? 'Enabled' : 'Disabled' }}
                  </KBadge>

                  <template v-else>
                    {{ value }}
                  </template>
                </DefinitionListItem>
              </DefinitionList>

              <DefinitionList>
                <DefinitionListItem :term="`Policies (${totalPolicyCount})`">
                  <ul>
                    <li
                      v-for="(policyType, index) in policyTypes"
                      :key="index"
                    >
                      <router-link
                        :to="{
                          name: 'policies-list-view',
                          params: {
                            policyPath: policyType.path
                          }
                        }"
                      >
                        {{ policyType.name }}: {{ policyType.total }}
                      </router-link>
                    </li>
                  </ul>
                </DefinitionListItem>
              </DefinitionList>
            </div>
          </template>
        </KCard>

        <KCard>
          <template #body>
            <ResourceCodeBlock
              id="code-block-mesh"
              :resource-fetcher="fetchMesh"
              :resource-fetcher-watch-key="mesh?.name || null"
            />
          </template>
        </KCard>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { KBadge, KCard } from '@kong/kongponents'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import MeshCharts from '../components/MeshCharts.vue'
import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import DefinitionList from '@/app/common/DefinitionList.vue'
import DefinitionListItem from '@/app/common/DefinitionListItem.vue'
import ResourceCodeBlock from '@/app/common/ResourceCodeBlock.vue'
import StatusInfo from '@/app/common/StatusInfo.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import { useStore } from '@/store/store'
import type { SingleResourceParameters } from '@/types/api.d'
import { Mesh, MeshInsight } from '@/types/index.d'
import { useKumaApi, useI18n } from '@/utilities'
import { notEmpty } from '@/utilities/notEmpty'

const { t, formatIsoDate } = useI18n()

const kumaApi = useKumaApi()
const route = useRoute()
const store = useStore()

const isLoading = ref(true)
const error = ref<Error | null>(null)
const mesh = ref<Mesh | null>(null)
const meshInsights = ref<MeshInsight | null>(null)

const basicMesh = computed(() => {
  if (mesh.value === null || meshInsights.value === null) {
    return null
  }

  const { name, creationTime, modificationTime } = mesh.value
  return {
    name,
    created: formatIsoDate(creationTime),
    modified: formatIsoDate(modificationTime),
    'Data Plane Proxies': meshInsights.value.dataplanes.total,
  }
})

const extendedMesh = computed(() => {
  if (mesh.value === null) {
    return null
  }

  const mtls = getBackendData(mesh.value, 'mtls')
  const logging = getBackendData(mesh.value, 'logging')
  const metrics = getBackendData(mesh.value, 'metrics')
  const tracing = getBackendData(mesh.value, 'tracing')
  const localityAwareLoadBalancing = Boolean(mesh.value.routing?.localityAwareLoadBalancing)

  return {
    mtls,
    logging,
    metrics,
    tracing,
    localityAwareLoadBalancing,
  }
})

const totalPolicyCount = computed(() => {
  if (meshInsights.value === null) {
    return 0
  }

  return Object.values(meshInsights.value.policies).reduce((total, stat) => total + stat.total, 0)
})
const policyTypes = computed(() => {
  if (meshInsights.value === null) {
    return []
  }

  return Object.entries(meshInsights.value.policies)
    .map(([policyTypeName, stat]) => {
      const policyType = store.state.policyTypesByName[policyTypeName]

      if (policyType && stat.total !== 0) {
        return {
          name: policyType.name,
          path: policyType.path,
          total: stat.total,
        }
      }

      return null
    })
    .filter(notEmpty)
})

loadMesh()

async function loadMesh(): Promise<void> {
  isLoading.value = true
  error.value = null

  const name = route.params.mesh as string

  try {
    mesh.value = await kumaApi.getMesh({ name })
    meshInsights.value = await kumaApi.getMeshInsights({ name })
  } catch (err) {
    if (err instanceof Error) {
      error.value = err
    } else {
      console.error(error)
    }
    mesh.value = null
    meshInsights.value = null
  } finally {
    isLoading.value = false
  }
}

function getBackendData(mesh: Mesh, field: 'mtls' | 'logging' | 'metrics' | 'tracing'): string | boolean {
  if (mesh === null || mesh[field] === undefined) {
    return false
  }

  const enabledBackendName = mesh[field].enabledBackend ?? mesh[field].defaultBackend ?? mesh[field].backends[0].name
  const enabledBackend = mesh[field].backends.find((backend: any) => backend.name === enabledBackendName)

  return `${enabledBackend.type} / ${enabledBackend.name}`
}

async function fetchMesh(params?: SingleResourceParameters) {
  const name = route.params.mesh as string
  return await kumaApi.getMesh({ name }, params)
}
</script>
<style scoped>
  .policy-counts li li {
    margin: 0;
  }
</style>
