<template>
  <KCard>
    <template #body>
      <MeshCharts />
    </template>
  </KCard>

  <KCard
    v-if="mesh !== null"
    class="mt-4"
  >
    <template #body>
      <LabelList
        :has-error="hasError"
        :is-loading="isLoading"
        :is-empty="isEmpty"
      >
        <div>
          <ul>
            <li
              v-for="(value, key) in basicMesh"
              :key="key"
            >
              <h4>{{ key }}</h4>

              <KBadge
                v-if="typeof value === 'boolean'"
                :appearance="value ? 'success' : 'danger'"
              >
                {{ value ? 'Enabled' : 'Disabled' }}
              </KBadge>

              <p v-else>
                {{ value }}
              </p>
            </li>
          </ul>
        </div>

        <div>
          <ul>
            <li
              v-for="(value, key) in extendedMesh"
              :key="key"
            >
              <h4>{{ key }}</h4>

              <KBadge
                v-if="typeof value === 'boolean'"
                :appearance="value ? 'success' : 'danger'"
              >
                {{ value ? 'Enabled' : 'Disabled' }}
              </KBadge>

              <p v-else>
                {{ value }}
              </p>
            </li>
          </ul>
        </div>

        <div>
          <ul class="policy-counts">
            <li>
              <h4>
                Policies ({{ totalPolicyCount }})
              </h4>
              <ul>
                <template
                  v-for="(item, key) in policyCounts"
                  :key="key"
                >
                  <li
                    v-if="item.length !== 0"
                  >
                    <router-link
                      :to="{
                        name: 'policy',
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
            </li>
          </ul>
        </div>
      </LabelList>
    </template>
  </KCard>

  <KCard
    v-if="rawMesh !== null"
    class="mt-4"
  >
    <template #body>
      <YamlView
        id="code-block-mesh"
        :content="rawMesh"
      />
    </template>
  </KCard>

  <MeshResources class="mt-6" />
</template>

<script lang="ts" setup>
import { KBadge, KCard } from '@kong/kongponents'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import MeshCharts from '../components/MeshCharts.vue'
import LabelList from '@/app/common/LabelList.vue'
import MeshResources from '@/app/common/MeshResources.vue'
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
const isEmpty = ref(false)
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
  // Ensures basic state is reset when switching meshes using the mesh selector.
  isLoading.value = true
  isEmpty.value = false
  hasError.value = false

  loadMesh()
})

loadMesh()

async function loadMesh(): Promise<void> {
  isLoading.value = true
  isEmpty.value = false

  const name = route.params.mesh as string

  try {
    mesh.value = await kumaApi.getMesh({ name })
    meshInsights.value = await kumaApi.getMeshInsights({ name })
  } catch (error) {
    hasError.value = true
    isEmpty.value = true

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
