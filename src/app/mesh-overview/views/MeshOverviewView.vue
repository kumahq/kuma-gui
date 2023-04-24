<template>
  <div class="kcard-stack">
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
            :has-error="hasError"
            :is-empty="mesh === null || meshInsights === null"
          >
            <DefinitionList>
              <DefinitionListItem
                v-for="(value, property) in basicMesh"
                :key="property"
                :term="property"
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
          </StatusInfo>

          <DefinitionList>
            <DefinitionListItem
              v-for="(value, property) in extendedMesh"
              :key="property"
              :term="property"
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
                <template
                  v-for="(item, index) in policyCounts"
                  :key="index"
                >
                  <li v-if="item.length !== 0">
                    <router-link
                      :to="{
                        name: 'policy-list-view',
                        params: {
                          policyPath: item.path
                        }
                      }"
                    >
                      {{ item.name }}: {{ item.length }}
                    </router-link>
                  </li>
                </template>
              </ul>
            </DefinitionListItem>
          </DefinitionList>
        </div>
      </template>
    </KCard>

    <KCard v-if="rawMesh !== null">
      <template #body>
        <YamlView
          id="code-block-mesh"
          :content="rawMesh"
        />
      </template>
    </KCard>

    <MeshResources />
  </div>
</template>

<script lang="ts" setup>
import { KBadge, KCard } from '@kong/kongponents'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import MeshCharts from '../components/MeshCharts.vue'
import DefinitionList from '@/app/common/DefinitionList.vue'
import DefinitionListItem from '@/app/common/DefinitionListItem.vue'
import MeshResources from '@/app/common/MeshResources.vue'
import StatusInfo from '@/app/common/StatusInfo.vue'
import YamlView from '@/app/common/YamlView.vue'
import { useStore } from '@/store/store'
import { Mesh, MeshInsight } from '@/types/index.d'
import { useKumaApi } from '@/utilities'
import { humanReadableDate, stripTimes } from '@/utilities/helpers'

const kumaApi = useKumaApi()
const route = useRoute()
const store = useStore()

const isLoading = ref(true)
const hasError = ref(false)
const mesh = ref<Mesh | null>(null)
const meshInsights = ref<MeshInsight | null>(null)
const rawMesh = computed(() => mesh.value !== null ? stripTimes(mesh.value) : null)

const basicMesh = computed(() => {
  if (mesh.value === null) {
    return null
  }

  const { name, type, creationTime, modificationTime } = mesh.value
  return {
    name,
    type,
    created: humanReadableDate(creationTime),
    modified: humanReadableDate(modificationTime),
    'Data Plane Proxies': store.state.meshInsight.dataplanes.total,
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

const totalPolicyCount = computed(() => store.state.sidebar.insights.mesh.policies.total)

const policyCounts = computed(() => {
  return store.state.policyTypes.map((policyType) => ({
    ...policyType,
    length: store.state.meshInsight.policies[policyType.name]?.total ?? 0,
  }))
})

watch(() => route.params.mesh, function () {
  // Don’t trigger a load when the user is navigating to another route.
  if (route.name !== 'single-mesh-overview') {
    return
  }

  loadMesh()
})

loadMesh()

async function loadMesh(): Promise<void> {
  isLoading.value = true
  hasError.value = false

  const name = route.params.mesh as string

  try {
    mesh.value = await kumaApi.getMesh({ name })
    meshInsights.value = await kumaApi.getMeshInsights({ name })
  } catch (error) {
    hasError.value = true
    mesh.value = null
    meshInsights.value = null

    console.error(error)
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
</script>
<style scoped>
  .policy-counts li li {
    margin: 0;
  }
</style>
