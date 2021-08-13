<template>
  <div class="gateway-dataplanes">
    <Dataplanes v-bind="$data" />
  </div>
</template>

<script>
import Dataplanes from '@/views/Entities/partial/Dataplanes'

export default {
  name: 'GatewayDataplanes',
  metaInfo: {
    title: 'Gateway Data plane proxies',
  },
  components: {
    Dataplanes,
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
