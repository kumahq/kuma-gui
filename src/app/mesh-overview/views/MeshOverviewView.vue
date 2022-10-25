<template>
  <MeshCharts />

  <MeshResources class="mt-8" />

  <TabsWidget
    v-if="mesh !== null"
    class="mt-8"
    :has-error="hasError"
    :is-loading="isLoading"
    :tabs="tabs"
    initial-tab-override="overview"
  >
    <template #overview>
      <LabelList>
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
      </LabelList>
    </template>

    <template #resources>
      <LabelList
        :has-error="hasError"
        :is-loading="isLoading"
        :is-empty="isEmpty"
      >
        <div
          v-for="i in Math.ceil(policyCounts.length / 3)"
          :key="i"
        >
          <ul>
            <li
              v-for="(item, key) in policyCounts.slice((i - 1) * 3, i * 3)"
              :key="key"
            >
              <h4>{{ item.title }}</h4>

              <p>{{ item.value }}</p>
            </li>
          </ul>
        </div>
      </LabelList>
    </template>
  </TabsWidget>

  <div
    v-if="rawMesh !== null"
    class="mt-8"
  >
    <YamlView
      id="code-block-mesh"
      :content="rawMesh"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { KBadge } from '@kong/kongponents'

import MeshCharts from '../components/MeshCharts.vue'
import MeshResources from '@/app/common/MeshResources.vue'
import LabelList from '@/app/common/LabelList.vue'
import TabsWidget from '@/app/common/TabsWidget.vue'
import YamlView from '@/app/common/YamlView.vue'
import Kuma from '@/services/kuma'
import { Mesh, MeshInsight } from '@/types'
import { humanReadableDate, stripTimes } from '@/helpers'
import { useStore } from '@/store/store'

const route = useRoute()
const store = useStore()

const tabs = [
  {
    hash: '#overview',
    title: 'Overview',
  },
  {
    hash: '#resources',
    title: 'Resources',
  },
]

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

const policyCounts = computed(() => {
  const policies = store.state.policies.map((policy) => ({
    title: policy.pluralDisplayName,
    value: store.state.meshInsight.policies[policy.name]?.total ?? 0,
  }))

  return [
    {
      title: 'Data Plane Proxies',
      value: store.state.meshInsight.dataplanes.total,
    },
    ...policies,
  ]
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
    mesh.value = await Kuma.getMesh({ name })
    meshInsights.value = await Kuma.getMeshInsights({ name })
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
