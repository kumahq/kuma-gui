<template>
  <h4 class="text-lg font-medium">
    <span class="color-green-400">

      Connect time: {{ details.connectTime | rawReadableDateFilter }}
    </span>
    <span
      v-if="details.disconnectTime"
      class="ml-4 color-red-400"
    >
      Disconnect time: {{ details.disconnectTime | rawReadableDateFilter }}
    </span>
  </h4>
</template>

<script>
import { rawReadableDate } from '@/helpers'
export default {
  name: 'ZoneInsightSubscriptionHeader',
  filters: {
    rawReadableDateFilter(value) {
      return rawReadableDate(value)
    },
  },
  props: {
    details: {
      type: Object,
      required: true,
    },
  },
}
</script>
