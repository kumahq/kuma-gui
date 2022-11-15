
<template>
  <div>
    <LabelList
      :has-error="hasError"
      :is-loading="isLoading"
      :is-empty="!hasDataplanes"
    >
      <ul>
        <li>
          <h4>Dataplanes</h4>
          <input
            id="dataplane-search"
            v-model="searchInput"
            type="text"
            class="k-input mb-4"
            placeholder="Filter by name"
            required
            data-testid="dataplane-search-input"
          >
          <p
            v-for="(dataplane, key) in filteredDataplanes"
            :key="key"
            class="my-1"
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
        </li>
      </ul>
    </LabelList>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'

import { kumaApi } from '@/api/kumaApi'
import LabelList from '@/app/common/LabelList.vue'

const props = defineProps({
  mesh: {
    type: String,
    required: true,
  },

  policyType: {
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
  fetchPolicyConntections()
})

onMounted(function () {
  fetchPolicyConntections()
})

async function fetchPolicyConntections(): Promise<void> {
  hasError.value = false
  isLoading.value = true

  try {
    const { items, total } = await kumaApi.getPolicyConnections({
      mesh: props.mesh,
      policyType: props.policyType,
      policyName: props.policyName,
    })

    hasDataplanes.value = total > 0

    dataplanes.value = items
  } catch {
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}
</script>
