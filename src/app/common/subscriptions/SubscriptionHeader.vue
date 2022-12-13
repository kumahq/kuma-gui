<template>
  <h4 class="text-lg font-medium">
    <span class="color-green-500">
      Connect time: {{ rawReadableDateFilter(details.connectTime) }}
    </span>

    <span
      v-if="details.disconnectTime"
      class="ml-4 color-red-600"
    >
      Disconnect time: {{ rawReadableDateFilter(details.disconnectTime) }}
    </span>
  </h4>
</template>

<script>
import { rawReadableDate } from '@/utilities/helpers'

export default {
  name: 'SubscriptionHeader',

  props: {
    details: {
      type: Object,
      required: true,
    },
  },

  methods: {
    rawReadableDateFilter(value) {
      return rawReadableDate(value)
    },
  },
}
</script>
