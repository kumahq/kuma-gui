<template>
  <div class="stack">
    <OnboardingAlert v-if="globalInsight.dataplanes.standard.total === 0" />

    <ControlPlaneStatus
      :can-use-zones="props.canUseZones"
      :global-insight="globalInsight"
    />
  </div>
</template>

<script lang="ts" setup>
import OnboardingAlert from './OnboardingAlert.vue'
import { useControlPlaneStatus } from '../'
import type { GlobalInsight } from '@/app/control-planes/data'

const ControlPlaneStatus = useControlPlaneStatus()

const props = defineProps<{
  globalInsight: GlobalInsight
  canUseZones: boolean
}>()
</script>
