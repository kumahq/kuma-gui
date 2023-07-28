<template>
  <h4 class="text-lg font-medium">
    <span class="color-green-500">
      Connect time: {{ formatIsoDate(props.details.connectTime) }}
    </span>

    <span
      v-if="props.details.disconnectTime"
      class="ml-4 color-red-600"
    >
      Disconnect time: {{ formatIsoDate(props.details.disconnectTime) }}
    </span>
  </h4>
</template>

<script lang="ts" setup>
import { useI18n } from '@/utilities'

const { formatIsoDate } = useI18n()

const props = defineProps({
  details: {
    type: Object,
    required: true,
  },
})
</script>
