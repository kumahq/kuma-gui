<template>
  <div class="stack">
    <OnboardingAlert v-if="globalInsight.meshes.total === 1" />

    <ControlPlaneStatus
      :can-use-zones="props.canUseZones"
      :global-insight="globalInsight"
    />
  </div>
</template>

<script lang="ts" setup>
import OnboardingAlert from './OnboardingAlert.vue'
import { useControlPlaneStatus } from '../'
import type { GlobalInsight } from '@/types/index.d'

const ControlPlaneStatus = useControlPlaneStatus()

const props = defineProps<{
  globalInsight: GlobalInsight
  canUseZones: boolean
}>()
</script>
