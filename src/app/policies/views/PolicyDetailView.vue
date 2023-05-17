<template>
  <PolicyDetails
    v-if="policyType && rawEntity !== null"
    :name="props.policyName"
    :mesh="props.mesh"
    :path="props.policyPath"
    :type="policyType.name"
    :raw-entity="rawEntity"
  />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import PolicyDetails from '../components/PolicyDetails.vue'
import { useStore } from '@/store/store'
import type { PolicyEntity } from '@/types/index.d'
import { useKumaApi } from '@/utilities'
import { stripTimes } from '@/utilities/helpers'

const kumaApi = useKumaApi()
const route = useRoute()
const store = useStore()

const props = defineProps<{
  mesh: string,
  policyPath: string,
  policyName: string,
}>()

const isLoading = ref<Boolean>(true)
const error = ref<Error | null>(null)
const policy = ref<PolicyEntity | null>(null)

const policyType = computed(() => store.state.policyTypesByPath[props.policyPath])
const rawEntity = computed(() => policy.value !== null ? stripTimes(policy.value) : null)

start()

function start() {
  store.dispatch('updatePageTitle', route.params.policy)

  loadData(props)
}

async function loadData({ mesh, policyPath, policyName }: { mesh: string, policyPath: string, policyName: string }) {
  isLoading.value = true
  error.value = null
  policy.value = null

  try {
    policy.value = await kumaApi.getSinglePolicyEntity({
      mesh,
      path: policyPath,
      name: policyName,
    })
  } catch (err) {
    if (err instanceof Error) {
      error.value = err
    } else {
      console.error(err)
    }
  } finally {
    isLoading.value = false
  }
}
</script>
