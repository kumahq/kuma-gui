<template>
  <div class="gateway-dataplanes">
    <DataplanesView v-bind="$data" />
  </div>
</template>

<script>
import DataplanesView from '@/views/Entities/partial/DataplanesView.vue'

export default {
  name: 'GatewayDataplanes',

  components: {
    DataplanesView,
  },

  data() {
    return {
      dataplaneApiParams: {
        gateway: true,
      },
      emptyStateMsg: 'There are no Gateway data plane proxies present.',
    }
  },
}
</script>
