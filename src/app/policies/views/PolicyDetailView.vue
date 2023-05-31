<template>
  <PolicyDetails
    v-if="policyType"
    :name="props.policyName"
    :mesh="props.mesh"
    :path="props.policyPath"
    :type="policyType.name"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import PolicyDetails from '../components/PolicyDetails.vue'
import { useStore } from '@/store/store'

const store = useStore()

const props = defineProps<{
  mesh: string,
  policyPath: string,
  policyName: string,
}>()

const policyType = computed(() => store.state.policyTypesByPath[props.policyPath])
</script>
