<template>
  <StatusInfo
    :has-error="hasError"
    :is-loading="isLoading"
    :is-empty="!hasDataplanes"
  >
    <h2>Dataplanes</h2>

    <input
      id="dataplane-search"
      v-model="searchInput"
      type="text"
      class="k-input mt-4"
      placeholder="Filter by name"
      required
      data-testid="dataplane-search-input"
    >

    <p
      v-for="(dataplane, key) in filteredDataplanes"
      :key="key"
      class="mt-2"
      data-testid="dataplane-name"
    >
      <router-link
        :to="{
          name: 'data-plane-detail-view',
          params: {
            mesh: dataplane.dataplane.mesh,
            dataPlane: dataplane.dataplane.name,
          },
        }"
      >
        {{ dataplane.dataplane.name }}
      </router-link>
    </p>
  </StatusInfo>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'

import StatusInfo from '@/app/common/StatusInfo.vue'
import { useKumaApi } from '@/utilities'

const kumaApi = useKumaApi()

const props = defineProps({
  mesh: {
    type: String,
    required: true,
  },

  policyPath: {
    type: String,
    required: true,
  },

  policyName: {
    type: String,
    required: true,
  },
})

const hasDataplanes = ref(false)
const isLoading = ref(true)
const hasError = ref(false)
const dataplanes = ref<any[]>([])
const searchInput = ref('')

const filteredDataplanes = computed(() => {
  const lowerCasedInput = searchInput.value.toLowerCase()

  return dataplanes.value.filter(({ dataplane }) => dataplane.name.toLowerCase().includes(lowerCasedInput))
})

watch(() => props.policyName, function () {
  fetchPolicyConnections()
})

onMounted(function () {
  fetchPolicyConnections()
})

async function fetchPolicyConnections(): Promise<void> {
  hasError.value = false
  isLoading.value = true

  try {
    const { items, total } = await kumaApi.getPolicyConnections({
      mesh: props.mesh,
      policyPath: props.policyPath,
      policyName: props.policyName,
    })

    hasDataplanes.value = total > 0

    dataplanes.value = items ?? []
  } catch {
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}
</script>
